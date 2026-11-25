"""Unauthenticated Flask API for events and registrations stored in Supabase."""

import os
from uuid import UUID

from flask import Flask, jsonify, request, send_from_directory
from postgrest import APIError
from supabase import Client, create_client

try:
    from dotenv import load_dotenv
except ModuleNotFoundError:
    # Loading a local .env file is optional; deployed environments can provide
    # configuration through environment variables directly.
    def load_dotenv():
        return False

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
supabase: Client | None = create_client(url, key) if url and key else None


def db():
    if supabase is None:
        return None, (jsonify(error="Supabase is not configured; set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."), 500)
    return supabase, None


def valid_uuid(value):
    try:
        return str(UUID(str(value)))
    except (ValueError, TypeError, AttributeError):
        return None


def api_error(error):
    # PostgREST uses 23505 for unique constraint violations.
    code = getattr(error, "code", None)
    status = 409 if code == "23505" else 400
    return jsonify(error=getattr(error, "message", str(error))), status


FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))


@app.get("/")
def index():
    if os.path.exists(os.path.join(FRONTEND_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIR, "index.html")
    return jsonify(name="Events API", endpoints=[
        "GET /api/events", "GET /api/events/<id>", "POST /api/registrations",
        "GET /api/me/registrations?user_id=<uuid>",
        "GET /api/events/<id>/registrations?organizer_id=<uuid>",
    ])


@app.get("/api")
def api_index():
    return jsonify(name="Events API", endpoints=[
        "GET /api/events", "GET /api/events/<id>", "POST /api/registrations",
        "GET /api/me/registrations?user_id=<uuid>",
        "GET /api/events/<id>/registrations?organizer_id=<uuid>",
    ])


@app.get("/health")
def health():
    """Lightweight process health check."""
    return jsonify(status="ok")


@app.get("/api/events")
def list_events():
    client, error = db()
    if error:
        return error
    try:
        query = client.table("events").select("*")
        status = request.args.get("status")
        if status:
            query = query.eq("status", status)
        result = query.execute()
        return jsonify(result.data)
    except APIError as exc:
        return api_error(exc)


@app.get("/api/events/<event_id>")
def get_event(event_id):
    event_id = valid_uuid(event_id)
    if not event_id:
        return jsonify(error="event id must be a UUID"), 400
    client, error = db()
    if error:
        return error
    try:
        result = client.table("events").select("*").eq("id", event_id).maybe_single().execute()
        if not result.data:
            return jsonify(error="Event not found"), 404
        return jsonify(result.data)
    except APIError as exc:
        return api_error(exc)


@app.post("/api/registrations")
def create_registration():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="Request body must be a JSON object"), 400
    user_id, event_id = valid_uuid(payload.get("user_id")), valid_uuid(payload.get("event_id"))
    if not user_id or not event_id:
        return jsonify(error="user_id and event_id are required UUIDs"), 400
    client, error = db()
    if error:
        return error
    try:
        event_result = client.table("events").select("id,capacity,status").eq("id", event_id).maybe_single().execute()
        event = event_result.data
        if not event:
            return jsonify(error="Event not found"), 404
        if event.get("capacity") is not None:
            count = client.table("registrations").select("id", count="exact").eq("event_id", event_id).execute().count
            if count is not None and count >= event["capacity"]:
                return jsonify(error="Event is at capacity"), 409
        result = client.table("registrations").insert({"user_id": user_id, "event_id": event_id}).execute()
        return jsonify(result.data[0] if result.data else {}), 201
    except APIError as exc:
        return api_error(exc)


@app.get("/api/me/registrations")
def my_registrations():
    # In the absence of authentication, callers supply their own user_id.
    user_id = valid_uuid(request.args.get("user_id"))
    if not user_id:
        return jsonify(error="user_id query parameter must be a UUID"), 400
    client, error = db()
    if error:
        return error
    try:
        result = (client.table("registrations").select("*, events(*)")
                  .eq("user_id", user_id).order("created_at", desc=True).execute())
        return jsonify(result.data)
    except APIError as exc:
        return api_error(exc)


@app.get("/api/events/<event_id>/registrations")
def event_registrations(event_id):
    event_id = valid_uuid(event_id)
    organizer_id = valid_uuid(request.args.get("organizer_id"))
    if not event_id:
        return jsonify(error="event id must be a UUID"), 400
    if not organizer_id:
        return jsonify(error="organizer_id query parameter must be a UUID"), 400
    client, error = db()
    if error:
        return error
    try:
        event_result = client.table("events").select("id,organizer_id").eq("id", event_id).maybe_single().execute()
        event = event_result.data
        if not event:
            return jsonify(error="Event not found"), 404
        if event.get("organizer_id") != organizer_id:
            return jsonify(error="Only the event organizer may view its registrations"), 403
        result = client.table("registrations").select("*, users(*)").eq("event_id", event_id).order("created_at").execute()
        return jsonify(result.data)
    except APIError as exc:
        return api_error(exc)


@app.get("/<path:path>")
def static_proxy(path):
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    return jsonify(error="Not found"), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=os.getenv("FLASK_DEBUG") == "1")
 
