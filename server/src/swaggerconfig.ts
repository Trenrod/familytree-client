const getSwaggerConfig = function (host: string, port: number): any {
    return {
        "swagger": "2.0",
        "info": {
            "version": "1.0.0",
            "title": "FamilyTree backend API",
            "description": "",
            "license": {
                "name": "MIT",
                "url": "https://opensource.org/licenses/MIT"
            }
        },
        "host": `${host}:${port}`,
        "basePath": "/",
        "tags": [
            {
                "name": "Person",
                "description": "Represents a person"
            }
        ],
        "paths": {
            "/person/all": {
                "get": {
                    "tags": [
                        "Person"
                    ],
                    "summary": "Gets all persons",
                    "responses": {
                        "200": {
                            "description": "OK",
                            "schema": {
                                "$ref": "#/definitions/PersonsWithId"
                            }
                        }
                    }
                }
            },
            "/person/{id}": {
                "get": {
                    "tags": [
                        "Person"
                    ],
                    "summary": "Gets a person",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "type": "integer",
                            "description": "Person Id"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK",
                            "schema": {
                                "$ref": "#/definitions/PersonWithId"
                            }
                        }
                    }
                },
                "put": {
                    "tags": [
                        "Person"
                    ],
                    "summary": "Update exising person",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "type": "integer",
                            "description": "Person Id"
                        },
                        {
                            "name": "person",
                            "in": "body",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Person"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK",
                            "schema": {
                                "$ref": "#/definitions/Person"
                            }
                        }
                    }
                },
                "delete": {
                    "tags": [
                        "Person"
                    ],
                    "summary": "Delete exising person",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "type": "integer",
                            "description": "Person Id"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK",
                            "schema": {
                                "$ref": "#/definitions/Person"
                            }
                        }
                    }
                }
            },
            "/person": {
                "post": {
                    "tags": [
                        "Person"
                    ],
                    "summary": "Add a new person",
                    "parameters": [
                        {
                            "name": "person",
                            "in": "body",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Person"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK",
                            "schema": {
                                "$ref": "#/definitions/Person"
                            }
                        }
                    }
                }
            },
            "/person/{id}/avatar": {
                "post": {
                    "tags": [
                        "Person"
                    ],
                    "summary": "Uploads avatar picture",
                    "consumes": [
                        "multipart/form-data"
                    ],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "type": "integer",
                            "description": "Person Id"
                        },
                        {
                            "in": "formData",
                            "name": "AvatarPicture",
                            "type": "file",
                            "description": "The file to upload."
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "avatarId": {
                                        "type": "string",
                                        "description": "UUID of the image. Also part of the url"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "definitions": {
            "PersonWithId": {
                "required": [
                    "id"
                ],
                "properties": {
                    "id": {
                        "type": "integer"
                    }
                },
                "allOf": [
                    {
                        "$ref": "#/definitions/Person"
                    }
                ]
            },
            "Person": {
                "properties": {
                    "forename": {
                        "type": "string"
                    },
                    "lastname": {
                        "type": "string"
                    },
                    "birthname": {
                        "type": "string"
                    },
                    "birthdate": {
                        "type": "string",
                        "format": "date"
                    },
                    "dayOfDeath": {
                        "type": "string",
                        "format": "date"
                    },
                    "placeOfDeath": {
                        "type": "string"
                    },
                    "placeOfBirth": {
                        "type": "string"
                    },
                    "fatherId": {
                        "type": "integer"
                    },
                    "motherId": {
                        "type": "integer"
                    },
                    "marriedToId": {
                        "type": "integer"
                    },
                    "avatar": {
                        "type": "boolean"
                    }
                }
            },
            "Persons": {
                "type": "array",
                "$ref": "#/definitions/Person"
            },
            "PersonsWithId": {
                "type": "array",
                "$ref": "#/definitions/PersonWithId"
            }
        },
        "schemes": [
            "http"
        ],
        "consumes": [
            "application/json"
        ],
        "produces": [
            "application/json"
        ]
    }
}

export default getSwaggerConfig;