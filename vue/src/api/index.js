export default {
    install(Vue) {
        Vue.prototype.$api = this;
    },
    async loadConfig() {
        this.config = {
            "id": "my-system",
            "display": {
                "en": {
                    "name": "",
                    "desc": ""
                },
                "zh": {
                    "name": "",
                    "desc": ""
                }
            },
            "locales": {
                "default": "en",
                "items": [
                    {
                        "id": "en",
                        "active": true,
                        "display": {
                            "en": {
                                "name": "",
                                "desc": ""
                            },
                            "zh": {
                                "name": "",
                                "desc": ""
                            }
                        }
                    },
                    {
                        "id": "zh",
                        "active": true,
                        "display": {
                            "en": {
                                "name": "",
                                "desc": ""
                            },
                            "zh": {
                                "name": "",
                                "desc": ""
                            }
                        }
                    }
                ]
            },
            "roles": [
                {
                    "id": "admin",
                    "active": true,
                    "display": {
                        "en": {
                            "name": "",
                            "desc": ""
                        },
                        "zh": {
                            "name": "",
                            "desc": ""
                        }
                    }
                },
                {
                    "id": "normal",
                    "active": true,
                    "display": {
                        "en": {
                            "name": "",
                            "desc": ""
                        },
                        "zh": {
                            "name": "",
                            "desc": ""
                        }
                    }
                }
            ],
            "port": 8090,
            "database": {
                "type": "mongodb",
                "url": "mongodb://localhost:27017",
                "name": "ds"
            },
            "auth": {
                "tokenExpiry": 43200000,
                "failTimes": 8,
                "danger": "lock"
            },
            "fieldGroups": [
                {
                    "id": "address",
                    "common": true,
                    "items": [
                        {
                            "id": "room",
                            "type": 100,
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {
                                "length": null,
                                "pattern": null
                            }
                        },
                        {
                            "id": "building",
                            "type": 100,
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {
                                "length": null,
                                "pattern": null
                            }
                        },
                        {
                            "id": "country",
                            "type": 100,
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {
                                "length": null,
                                "pattern": null
                            }
                        }
                    ]
                }
            ],
            "entities": [
                {
                    "id": "user",
                    "version": 1,
                    "history": [],
                    "parent": null,
                    "display": {
                        "en": {
                            "name": "",
                            "desc": ""
                        },
                        "zh": {
                            "name": "",
                            "desc": ""
                        }
                    },
                    "privacy": {
                        "default": "private",
                        "allow": [
                            "private",
                            "specific",
                            "public"
                        ],
                        "specific": {
                            "default": "company",
                            "allow": [
                                "company"
                            ],
                            "byUser": true
                        }
                    },
                    "fields": [
                        {
                            "id": "1",
                            "type": 100,
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {
                                "length": null,
                                "pattern": null
                            }
                        },
                        {
                            "id": "room",
                            "type": "field-group",
                            "target": "address",
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {}
                        },
                        {
                            "id": "roles",
                            "type": "roles",
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {}
                        },
                        {
                            "id": "groups",
                            "type": "roles",
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {}
                        }
                    ],
                    "actions": [
                        {
                            "id": "1",
                            "_type": "update",
                            "params": {
                                "target": "this",
                                "data": {
                                    "field1": "this.field1 + 1"
                                }
                            },
                            "wait": [
                                "actionId"
                            ],
                            "comment": ""
                        }
                    ],
                    "workflows": [],
                    "status": {
                        "default": "draft",
                        "categories": [
                            {
                                "id": "open",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            },
                            {
                                "id": "enable",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            },
                            {
                                "id": "disable",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            }
                        ],
                        "items": [
                            {
                                "id": "draft",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                }
                            },
                            {
                                "id": "approved",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "item",
                    "version": 1,
                    "history": [],
                    "parent": null,
                    "display": {
                        "en": {
                            "name": "",
                            "desc": ""
                        },
                        "zh": {
                            "name": "",
                            "desc": ""
                        }
                    },
                    "privacy": {
                        "default": "private",
                        "allow": [
                            "private",
                            "specific",
                            "public"
                        ],
                        "specific": {
                            "default": "company",
                            "allow": [
                                "company"
                            ],
                            "byUser": true
                        }
                    },
                    "fields": [
                        {
                            "id": "1",
                            "type": 100,
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {
                                "length": null,
                                "pattern": null
                            }
                        },
                        {
                            "id": "room",
                            "type": "field-group",
                            "target": "address",
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {}
                        }
                    ],
                    "actions": [
                        {
                            "id": "1",
                            "_type": "update",
                            "params": {
                                "target": "this",
                                "data": {
                                    "field1": "this.field1 + 1"
                                }
                            },
                            "wait": [
                                "actionId"
                            ],
                            "comment": ""
                        }
                    ],
                    "workflows": [],
                    "status": {
                        "default": "draft",
                        "categories": [
                            {
                                "id": "open",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            },
                            {
                                "id": "enable",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            },
                            {
                                "id": "disable",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            }
                        ],
                        "items": [
                            {
                                "id": "draft",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                }
                            },
                            {
                                "id": "approved",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "category",
                    "version": 1,
                    "history": [],
                    "parent": null,
                    "display": {
                        "en": {
                            "name": "",
                            "desc": ""
                        },
                        "zh": {
                            "name": "",
                            "desc": ""
                        }
                    },
                    "privacy": {
                        "default": "private",
                        "allow": [
                            "private",
                            "specific",
                            "public"
                        ],
                        "specific": {
                            "default": "company",
                            "allow": [
                                "company"
                            ],
                            "byUser": true
                        }
                    },
                    "fields": [
                        {
                            "id": "1",
                            "type": 100,
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {
                                "length": null,
                                "pattern": null
                            }
                        },
                        {
                            "id": "room",
                            "type": "field-group",
                            "target": "address",
                            "translation": false,
                            "constant": false,
                            "default": null,
                            "ui": [
                                "grid",
                                "table",
                                "view"
                            ],
                            "display": {
                                "en": {
                                    "name": "",
                                    "desc": ""
                                },
                                "zh": {
                                    "name": "",
                                    "desc": ""
                                }
                            },
                            "attr": {}
                        }
                    ],
                    "actions": [
                        {
                            "id": "1",
                            "_type": "update",
                            "params": {
                                "target": "this",
                                "data": {
                                    "field1": "this.field1 + 1"
                                }
                            },
                            "wait": [
                                "actionId"
                            ],
                            "comment": ""
                        }
                    ],
                    "workflows": [],
                    "status": {
                        "default": "draft",
                        "categories": [
                            {
                                "id": "open",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            },
                            {
                                "id": "enable",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            },
                            {
                                "id": "disable",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                },
                                "items": [
                                    "draft"
                                ]
                            }
                        ],
                        "items": [
                            {
                                "id": "draft",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                }
                            },
                            {
                                "id": "approved",
                                "display": {
                                    "en": {
                                        "name": "",
                                        "desc": ""
                                    },
                                    "zh": {
                                        "name": "",
                                        "desc": ""
                                    }
                                },
                                "workflows": [],
                                "access": {
                                    "2": false,
                                    "roleID": {
                                        "list": false,
                                        "fields": {
                                            "fieldIndex": 2
                                        },
                                        "draft": true,
                                        "submit": true
                                    }
                                }
                            }
                        ]
                    }
                }
            ],
            "ui": {
                "theme": "default",
                "props": {
                    "children": [
                        {
                            "blocks": "page-segment",
                            "props": {
                                "path": "item",
                                "index": {
                                    "blocks": "page",
                                    "props": {
                                        "path": "",
                                        "children": [
                                            {
                                                "blocks": "container",
                                                "props": {
                                                    "children": [
                                                        {
                                                            "path": {
                                                                "blocks": "grid",
                                                                "props": {
                                                                    "title": {
                                                                        "en": "goood",
                                                                        "zh": "goood"
                                                                    },
                                                                    "entity": "role"
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                "children": [
                                    {
                                        "blocks": "page",
                                        "props": {
                                            "path": "edit",
                                            "children": [
                                                {
                                                    "blocks": "form",
                                                    "props": {
                                                        "entity": "user"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        };
    },
    auth: {
        developmentMode: true
    }
};