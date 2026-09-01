import unittest
from graph import KnowledgeGraph, from_repo_examples, from_profile


class GraphTests(unittest.TestCase):
    def test_repo_examples_have_provenance(self):
        g = from_repo_examples()
        self.assertIn("room-graph", g.nodes)
        doors = g.neighbors("room-0", "door")
        self.assertTrue(doors)
        self.assertEqual(doors[0]["source"], "Graph/src/Room.java")
        self.assertIn("liters", doors[0]["note"])

    def test_unknown_name_is_empty(self):
        g = from_repo_examples()
        self.assertEqual(g.find_name("UMass Boston"), [])
        self.assertEqual(g.find_name("Hadoop"), [])

    def test_profile_does_not_make_him_gym_owner(self):
        profile = {
            "identity": {"name": "Jeffrey Gomez"},
            "experience": [
                {
                    "org": "DMV Iron Gym Inc",
                    "title": "Team Member & Systems Administrator",
                    "current": True,
                    "provenance": "resume-2026-08-27",
                }
            ],
            "education": [],
            "projects": [],
            "skills": ["Java"],
        }
        g = from_profile(profile)
        facts = g.facts_about("jeffrey")
        titles = " ".join(e["note"] for e in facts)
        self.assertIn("Team Member", titles)
        self.assertNotIn("CEO", titles)
        self.assertNotIn("founder", titles.lower())

    def test_path_room_graph_to_room(self):
        g = from_repo_examples()
        walk = g.path("room-graph", "room-1")
        self.assertIsNotNone(walk)
        self.assertEqual(walk[0], "room-graph")


if __name__ == "__main__":
    unittest.main()
