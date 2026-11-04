import type { FrozenPuzzle } from "./types";

// Baked once from the generator, then frozen: campaign levels never change when the generator does.
export const FROZEN_PUZZLES: readonly FrozenPuzzle[] = [
  {
    "id": "foret-1",
    "difficulty": "facile",
    "characterIds": [
      "gorak",
      "aldric",
      "ondine"
    ],
    "statements": [
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritIs",
          "characterId": "gorak",
          "expected": true
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "vengeur",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 1
      }
    ]
  },
  {
    "id": "foret-2",
    "difficulty": "facile",
    "characterIds": [
      "gorak",
      "ondine",
      "mira",
      "pip"
    ],
    "statements": [
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "belliqueux",
          "expected": true
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritIs",
          "characterId": "mira",
          "expected": false
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "characterTruth",
          "characterId": "ondine",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 3
      }
    ]
  },
  {
    "id": "foret-3",
    "difficulty": "facile",
    "characterIds": [
      "pip",
      "aldric",
      "elara",
      "neris"
    ],
    "statements": [
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritIs",
          "characterId": "neris",
          "expected": false
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "vengeur",
          "expected": false
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritIs",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "neris",
        "predicate": {
          "type": "characterTruth",
          "characterId": "aldric",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 3
      }
    ]
  },
  {
    "id": "marais-1",
    "difficulty": "normal",
    "characterIds": [
      "mira",
      "aldric",
      "pip",
      "varek"
    ],
    "statements": [
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "aldric",
          "expected": true
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "pacifiste",
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritIs",
          "characterId": "aldric",
          "expected": true
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "varek",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 1
      }
    ]
  },
  {
    "id": "marais-2",
    "difficulty": "normal",
    "characterIds": [
      "aldric",
      "ondine",
      "pip",
      "varek",
      "gorak"
    ],
    "statements": [
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "aldric",
          "expected": true
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "varek",
          "expected": false
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "characterTruth",
          "characterId": "aldric",
          "expected": false
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "characterTruth",
          "characterId": "varek",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 3
      }
    ]
  },
  {
    "id": "marais-3",
    "difficulty": "normal",
    "characterIds": [
      "karn",
      "gorak",
      "ondine",
      "brumm",
      "varek"
    ],
    "statements": [
      {
        "characterId": "karn",
        "predicate": {
          "type": "culpritIs",
          "characterId": "varek",
          "expected": true
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "karn",
          "expected": true
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "characterTruth",
          "characterId": "karn",
          "expected": true
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritIs",
          "characterId": "karn",
          "expected": false
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "ondine",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 4
      }
    ]
  },
  {
    "id": "plaines-1",
    "difficulty": "normal",
    "characterIds": [
      "gorak",
      "elara",
      "aldric",
      "mira",
      "brumm"
    ],
    "statements": [
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "brumm",
          "expected": true
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "elara",
          "expected": true
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "mira",
          "expected": true
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritIs",
          "characterId": "brumm",
          "expected": false
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "vengeur",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "truthCount",
        "count": 1
      }
    ]
  },
  {
    "id": "plaines-2",
    "difficulty": "difficile",
    "characterIds": [
      "aldric",
      "pip",
      "elara",
      "ondine",
      "brumm"
    ],
    "statements": [
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "pip",
          "expected": true
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritIs",
          "characterId": "aldric",
          "expected": true
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "brumm",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritIs",
          "characterId": "elara",
          "expected": false
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritIs",
          "characterId": "pip",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 1
      }
    ]
  },
  {
    "id": "plaines-3",
    "difficulty": "difficile",
    "characterIds": [
      "aldric",
      "pip",
      "elara",
      "sombrelame",
      "thalion",
      "ondine"
    ],
    "statements": [
      {
        "characterId": "aldric",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritIs",
            "characterId": "aldric",
            "expected": false
          }
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "vengeur",
          "expected": false
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "aldric",
          "expected": true
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "ondine",
          "expected": true
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritIs",
            "characterId": "ondine",
            "expected": false
          }
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "thalion",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "truthCountOneOf",
        "counts": [
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "montagnes-1",
    "difficulty": "difficile",
    "characterIds": [
      "thalion",
      "ondine",
      "neris",
      "brumm",
      "pip",
      "karn"
    ],
    "statements": [
      {
        "characterId": "thalion",
        "predicate": {
          "type": "characterTruth",
          "characterId": "neris",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "ondine",
          "expected": true
        }
      },
      {
        "characterId": "neris",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
          "expected": true
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "pip",
              "expected": false
            },
            {
              "type": "culpritAlignment",
              "alignment": "vengeur",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "karn",
          "expected": true
        }
      },
      {
        "characterId": "karn",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "vengeur",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "truthCountOneOf",
        "counts": [
          4,
          5
        ]
      }
    ]
  },
  {
    "id": "montagnes-2",
    "difficulty": "difficile",
    "characterIds": [
      "thalion",
      "brumm",
      "elara",
      "sombrelame",
      "pip",
      "mira"
    ],
    "statements": [
      {
        "characterId": "thalion",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritAlignment",
              "alignment": "pacifiste",
              "expected": true
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "sombrelame",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "mira",
          "expected": true
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "sombrelame",
          "expected": true
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "characterTruth",
          "characterId": "brumm",
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "mira",
          "expected": false
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "elara",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCountOneOf",
        "counts": [
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "montagnes-3",
    "difficulty": "expert",
    "characterIds": [
      "gorak",
      "elara",
      "mira",
      "varek",
      "neris",
      "ondine"
    ],
    "statements": [
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "varek",
          "expected": true
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "neris",
          "expected": false
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "neris",
              "expected": false
            },
            {
              "type": "culpritAlignment",
              "alignment": "belliqueux",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "characterTruth",
          "characterId": "gorak",
          "expected": true
        }
      },
      {
        "characterId": "neris",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "elara",
              "expected": false
            },
            {
              "type": "culpritIs",
              "characterId": "mira",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritIs",
          "characterId": "neris",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 1
      }
    ]
  },
  {
    "id": "desert-1",
    "difficulty": "expert",
    "characterIds": [
      "karn",
      "mira",
      "elara",
      "brumm",
      "thalion",
      "neris"
    ],
    "statements": [
      {
        "characterId": "karn",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "elara",
              "expected": true
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "karn",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritAlignment",
              "alignment": "belliqueux",
              "expected": true
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "brumm",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "thalion",
          "expected": true
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritIs",
          "characterId": "elara",
          "expected": false
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritIs",
            "characterId": "mira",
            "expected": false
          }
        }
      },
      {
        "characterId": "neris",
        "predicate": {
          "type": "characterTruth",
          "characterId": "brumm",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 1
      }
    ]
  },
  {
    "id": "desert-2",
    "difficulty": "expert",
    "characterIds": [
      "brumm",
      "elara",
      "karn",
      "aldric",
      "thalion",
      "pip",
      "sombrelame"
    ],
    "statements": [
      {
        "characterId": "brumm",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "thalion",
              "expected": false
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "sombrelame",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "karn",
              "expected": true
            },
            {
              "type": "culpritIs",
              "characterId": "thalion",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "karn",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritIs",
            "characterId": "karn",
            "expected": false
          }
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "thalion",
          "expected": false
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "sombrelame",
          "expected": true
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "brumm",
              "expected": true
            },
            {
              "type": "culpritIs",
              "characterId": "elara",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "karn",
              "expected": true
            },
            {
              "type": "characterTruth",
              "characterId": "aldric",
              "expected": false
            }
          ]
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 6
      }
    ]
  },
  {
    "id": "desert-3",
    "difficulty": "expert",
    "characterIds": [
      "elara",
      "pip",
      "thalion",
      "mira",
      "ondine",
      "aldric",
      "sombrelame"
    ],
    "statements": [
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritIs",
          "characterId": "pip",
          "expected": true
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritIs",
          "characterId": "thalion",
          "expected": true
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "characterTruth",
              "characterId": "sombrelame",
              "expected": true
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "pip",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "elara",
          "expected": true
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritIs",
            "characterId": "thalion",
            "expected": true
          }
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "pip",
              "expected": false
            },
            {
              "type": "characterTruth",
              "characterId": "thalion",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "characterTruth",
          "characterId": "thalion",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "truthCount",
        "count": 2
      }
    ]
  },
  {
    "id": "ombres-1",
    "difficulty": "expert",
    "characterIds": [
      "thalion",
      "pip",
      "mira",
      "ondine",
      "aldric",
      "brumm",
      "sombrelame"
    ],
    "statements": [
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "aldric",
          "expected": true
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritIs",
          "characterId": "sombrelame",
          "expected": true
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritNeighborOf",
            "characterId": "thalion",
            "expected": false
          }
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "mira",
              "expected": true
            },
            {
              "type": "characterTruth",
              "characterId": "pip",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritAlignment",
              "alignment": "belliqueux",
              "expected": true
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "mira",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "thalion",
          "expected": false
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "brumm",
              "expected": false
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "thalion",
              "expected": true
            }
          ]
        }
      }
    ],
    "rules": [
      {
        "type": "truthCountOneOf",
        "counts": [
          4,
          5
        ]
      }
    ]
  },
  {
    "id": "ombres-2",
    "difficulty": "expert",
    "characterIds": [
      "ondine",
      "gorak",
      "aldric",
      "thalion",
      "sombrelame",
      "varek",
      "elara",
      "pip"
    ],
    "statements": [
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
          "expected": true
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "ondine",
          "expected": true
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "sombrelame",
              "expected": false
            },
            {
              "type": "culpritIs",
              "characterId": "thalion",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "pip",
          "expected": true
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "thalion",
              "expected": true
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "varek",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "sombrelame",
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "aldric",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 2
      },
      {
        "type": "culpritCount",
        "counts": [
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "ombres-3",
    "difficulty": "expert",
    "characterIds": [
      "thalion",
      "ondine",
      "elara",
      "pip",
      "gorak",
      "sombrelame",
      "brumm",
      "mira"
    ],
    "statements": [
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "elara",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritNeighborOf",
            "characterId": "ondine",
            "expected": true
          }
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "characterTruth",
              "characterId": "sombrelame",
              "expected": true
            },
            {
              "type": "culpritNeighborOf",
              "characterId": "sombrelame",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "thalion",
              "expected": true
            },
            {
              "type": "culpritAlignment",
              "alignment": "belliqueux",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritNeighborOf",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "culpritIs",
          "characterId": "elara",
          "expected": false
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "ondine",
              "expected": false
            },
            {
              "type": "culpritIs",
              "characterId": "elara",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritNeighborOf",
              "characterId": "gorak",
              "expected": false
            },
            {
              "type": "characterTruth",
              "characterId": "ondine",
              "expected": false
            }
          ]
        }
      }
    ],
    "rules": [
      {
        "type": "truthCount",
        "count": 7
      }
    ]
  }
];
