import requests
import json
import csv


class Person:
    def __init__(self):
        self.id = None
        self.forename = None
        self.lastname = None
        self.birthname = None
        self.birthdate = None
        self.dayOfDeath = None
        self.placeOfDeath = None
        self.placeOfBirth = None
        self.fatherId = None
        self.motherId = None

    def toJson(self):
        return {
            "id": self.id if self.id != "" else None,
            "forename": self.forename if self.forename != "" else None,
            "lastname": self.lastname if self.lastname != "" else None,
            "birthname": self.birthname if self.birthname != "" else None,
            "dayOfDeath": self.dayOfDeath if self.dayOfDeath != "" else None,
            "placeOfDeath": self.placeOfDeath if self.placeOfDeath != "" else None,
            "placeOfBirth": self.placeOfBirth if self.placeOfBirth != "" else None,
            "fatherId": self.fatherId if self.fatherId != "" else None,
            "motherId": self.motherId if self.motherId != "" else None,
        }

    def toPerson(self, data):
        self.id = data["id"]
        self.forename = data["forename"]
        self.lastname = data["lastname"]
        self.birthname = data["birthname"]
        self.birthdate = data["birthdate"]
        self.dayOfDeath = data["dayOfDeath"]
        self.placeOfDeath = data["placeOfDeath"]
        self.placeOfBirth = data["placeOfBirth"]
        self.fatherId = data["fatherId"]
        self.motherId = data["motherId"]


people = []

with open("dummy.csv", newline="", encoding="utf8") as csvfile:
    personreader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_NONE)
    for row in personreader:
        if row[0] == "id":
            continue

        person = Person()
        person.toPerson(
            {
                "id": int(row[0]) if row[0] != "" else None,
                "forename": row[1] if row[1] != "" else None,
                "lastname": row[2] if row[2] != "" else None,
                "birthname": row[3] if row[3] != "" else None,
                "birthdate": row[4] if row[4] != "" else None,
                "dayOfDeath": row[5] if row[5] != "" else None,
                "placeOfDeath": row[6] if row[6] != "" else None,
                "placeOfBirth": row[7] if row[7] != "" else None,
                "fatherId": row[8] if row[7] != "" else None,
                "motherId": row[9] if row[8] != "" else None,
            }
        )
        people.append(person)

del people[0]
for person in people:
    r = requests.post("http://localhost:3000/person", json=person.toJson())
    print(r)
