"""
Small knowledge graph with provenance.

Nodes and edges are either:
  - loaded from site/content/jeffrey.json (resume facts), or
  - built from this repo (rooms, movies, books) so the demo runs without the site.

Every edge keeps a source string. Queries never invent a fact that is not in the graph.
"""
from __future__ import annotations

import json
import os
from collections import defaultdict


class KnowledgeGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = []
        self._out = defaultdict(list)

    def add_node(self, node_id, ntype, name, extra=None):
        self.nodes[node_id] = {
            "id": node_id,
            "type": ntype,
            "name": name,
            "extra": extra or {},
        }
        return node_id

    def add_edge(self, src, rel, dst, source, note=""):
        if src not in self.nodes or dst not in self.nodes:
            raise KeyError("both ends of an edge must already be nodes")
        edge = {
            "src": src,
            "rel": rel,
            "dst": dst,
            "source": source,
            "note": note,
        }
        self.edges.append(edge)
        self._out[src].append(edge)
        return edge

    def neighbors(self, node_id, rel=None):
        out = []
        for e in self._out.get(node_id, []):
            if rel is None or e["rel"] == rel:
                out.append(e)
        return out

    def find_name(self, text):
        needle = (text or "").strip().lower()
        hits = []
        for n in self.nodes.values():
            if needle and needle in n["name"].lower():
                hits.append(n)
            elif needle and needle in n["id"].lower():
                hits.append(n)
        return hits

    def facts_about(self, node_id):
        rows = []
        for e in self.edges:
            if e["src"] == node_id or e["dst"] == node_id:
                rows.append(e)
        return rows

    def path(self, start, goal, limit=8):
        if start not in self.nodes or goal not in self.nodes:
            return None
        q = [(start, [start])]
        seen = {start}
        while q:
            cur, walk = q.pop(0)
            if cur == goal:
                return walk
            if len(walk) >= limit:
                continue
            for e in self._out.get(cur, []):
                nxt = e["dst"]
                if nxt not in seen:
                    seen.add(nxt)
                    q.append((nxt, walk + [nxt]))
        return None

    def to_dict(self):
        return {"nodes": list(self.nodes.values()), "edges": self.edges}


def from_profile(profile):
    g = KnowledgeGraph()
    ident = profile.get("identity", {})
    person = g.add_node("jeffrey", "person", ident.get("name", "Jeffrey Gomez"), ident)
    for job in profile.get("experience", []):
        org_id = "org:" + job.get("org", "unknown").lower().replace(" ", "-")
        g.add_node(org_id, "org", job.get("org", ""), job)
        g.add_edge(
            person,
            "works_at" if job.get("current") else "worked_at",
            org_id,
            job.get("provenance", "resume"),
            job.get("title", ""),
        )
    for school in profile.get("education", []):
        sid = "edu:" + school.get("school", "").lower().replace(" ", "-")
        g.add_node(sid, "school", school.get("school", ""), school)
        g.add_edge(person, "studied_at", sid, school.get("provenance", "resume"), school.get("line", ""))
    for proj in profile.get("projects", []):
        if proj.get("visibility") == "omit":
            continue
        pid = "proj:" + proj.get("slug", proj.get("name", "x")).lower()
        g.add_node(pid, "project", proj.get("name", ""), proj)
        g.add_edge(person, "built", pid, proj.get("provenance", "github"), proj.get("path") or "")
        for sk in proj.get("stack", []):
            kid = "skill:" + sk.lower()
            if kid not in g.nodes:
                g.add_node(kid, "skill", sk)
            g.add_edge(pid, "uses", kid, proj.get("path") or "project", "")
    for sk in profile.get("skills", []):
        name = sk if isinstance(sk, str) else sk.get("name")
        kid = "skill:" + name.lower()
        if kid not in g.nodes:
            g.add_node(kid, "skill", name, sk if isinstance(sk, dict) else {})
        g.add_edge(person, "has_skill", kid, "resume", "")
    return g


def from_repo_examples():
    """Facts taken from Jeffrey's own project files, not from a tutorial dump."""
    g = KnowledgeGraph()
    g.add_node("room-graph", "project", "Room / FRIEND-BOT graph", {"path": "Graph/"})
    g.add_node("room-0", "room", "Room 0")
    g.add_node("room-1", "room", "Room 1")
    g.add_edge("room-graph", "contains", "room-0", "Graph/src/Room.java", "assignmentLabyrinth")
    g.add_edge("room-0", "door", "room-1", "Graph/src/Room.java", "5 liters")
    g.add_node("hash-m", "project", "Hash_M movie catalog", {"path": "HashMap/"})
    g.add_node("shining", "movie", "The Shining")
    g.add_edge("hash-m", "indexes", "shining", "HashMap/src/movies", "Drama,1980,Stanley Kubrick")
    g.add_node("books", "project", "Library book list", {"path": "Library_Books/"})
    g.add_node("hunger", "book", "The Hunger Games")
    g.add_edge("books", "shelves", "hunger", "Library_Books/booklist.txt", "Suzanne Collins, 2008")
    return g


def load_default():
    here = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(here, "..", "site", "content", "jeffrey.json"),
        os.path.join(here, "facts.json"),
    ]
    for path in candidates:
        if os.path.isfile(path):
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            if "identity" in data:
                g = from_profile(data)
                extra = from_repo_examples()
                for n in extra.nodes.values():
                    if n["id"] not in g.nodes:
                        g.nodes[n["id"]] = n
                for e in extra.edges:
                    if e["src"] in g.nodes and e["dst"] in g.nodes:
                        g.edges.append(e)
                        g._out[e["src"]].append(e)
                return g, path
            return from_repo_examples(), path
    return from_repo_examples(), None


def main():
    g, src = load_default()
    print("graph source:", src or "built-in repo examples")
    print("nodes", len(g.nodes), "edges", len(g.edges))
    hits = g.find_name("Frostburg") or g.find_name("Hash") or g.find_name("Room")
    if hits:
        print("example hit:", hits[0]["name"], "type", hits[0]["type"])
        about = g.facts_about(hits[0]["id"])
        for e in about[:5]:
            print(" ", e["src"], e["rel"], e["dst"], "←", e["source"])


if __name__ == "__main__":
    main()
