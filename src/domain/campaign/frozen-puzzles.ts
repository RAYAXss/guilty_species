import type { FrozenPuzzle } from "./types";

// Baked once from the generator (scripts/bake-campaign.ts), then frozen: campaign levels never change when the generator does.
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
      "pip",
      "aldric",
      "varek"
    ],
    "statements": [
      {
        "characterId": "mira",
        "predicate": {
          "type": "characterTruth",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 7,
          "expected": false
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 10,
          "expected": false
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 6,
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
    "id": "marais-2",
    "difficulty": "normal",
    "characterIds": [
      "gorak",
      "varek",
      "aldric",
      "pip",
      "ondine"
    ],
    "statements": [
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 7,
          "expected": true
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "pip",
          "expected": true
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 10,
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "characterTruth",
          "characterId": "varek",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "characterTruth",
          "characterId": "varek",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "truthCount",
        "count": 4
      }
    ]
  },
  {
    "id": "marais-3",
    "difficulty": "normal",
    "characterIds": [
      "ondine",
      "varek",
      "brumm",
      "karn",
      "gorak"
    ],
    "statements": [
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "karn",
          "expected": true
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 4,
          "expected": false
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "pacifiste",
          "expected": false
        }
      },
      {
        "characterId": "karn",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 4,
          "expected": false
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
          "expected": false
        }
      }
    ],
    "rules": [
      {
        "type": "truthCount",
        "count": 4
      }
    ]
  },
  {
    "id": "plaines-1",
    "difficulty": "normal",
    "characterIds": [
      "brumm",
      "gorak",
      "elara",
      "mira",
      "aldric"
    ],
    "statements": [
      {
        "characterId": "brumm",
        "predicate": {
          "type": "characterTruth",
          "characterId": "gorak",
          "expected": false
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "brumm",
          "expected": true
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 6,
          "expected": false
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritIs",
          "characterId": "gorak",
          "expected": true
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "aldric",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 2
      }
    ]
  },
  {
    "id": "plaines-2",
    "difficulty": "difficile",
    "characterIds": [
      "pip",
      "ondine",
      "aldric",
      "brumm",
      "elara"
    ],
    "statements": [
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 6,
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
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
              "type": "culpritStatAtLeast",
              "stat": "strength",
              "value": 4,
              "expected": true
            },
            {
              "type": "characterTruth",
              "characterId": "pip",
              "expected": false
            }
          ]
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
        "characterId": "elara",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
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
    "id": "plaines-3",
    "difficulty": "difficile",
    "characterIds": [
      "aldric",
      "sombrelame",
      "elara",
      "thalion",
      "pip",
      "ondine"
    ],
    "statements": [
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 8,
          "expected": false
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "vengeur",
          "expected": false
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
          "expected": true
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "elara",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 4,
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 2
      }
    ]
  },
  {
    "id": "montagnes-1",
    "difficulty": "difficile",
    "characterIds": [
      "thalion",
      "brumm",
      "pip",
      "ondine",
      "neris",
      "karn"
    ],
    "statements": [
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "belliqueux",
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "belliqueux",
          "expected": false
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 4,
          "expected": true
        }
      },
      {
        "characterId": "neris",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 9,
          "expected": true
        }
      },
      {
        "characterId": "karn",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "neris",
          "expected": true
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
    "id": "montagnes-2",
    "difficulty": "difficile",
    "characterIds": [
      "elara",
      "mira",
      "thalion",
      "sombrelame",
      "brumm",
      "pip"
    ],
    "statements": [
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "belliqueux",
          "expected": true
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "pacifiste",
          "expected": false
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 10,
          "expected": true
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "characterTruth",
          "characterId": "elara",
          "expected": true
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritStatAtLeast",
            "stat": "strength",
            "value": 4,
            "expected": false
          }
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "elara",
          "expected": false
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
      "elara",
      "mira",
      "gorak",
      "neris",
      "varek",
      "ondine"
    ],
    "statements": [
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "gorak",
          "expected": false
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritStatAbove",
            "stat": "strength",
            "characterId": "ondine",
            "expected": false
          }
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritStatAbove",
            "stat": "intelligence",
            "characterId": "mira",
            "expected": true
          }
        }
      },
      {
        "characterId": "neris",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 10,
          "expected": false
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
        "characterId": "ondine",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritStatAtLeast",
              "stat": "strength",
              "value": 3,
              "expected": true
            },
            {
              "type": "characterTruth",
              "characterId": "mira",
              "expected": false
            }
          ]
        }
      }
    ],
    "rules": [
      {
        "type": "liarCount",
        "count": 2
      }
    ]
  },
  {
    "id": "desert-1",
    "difficulty": "expert",
    "characterIds": [
      "thalion",
      "karn",
      "elara",
      "brumm",
      "mira",
      "neris"
    ],
    "statements": [
      {
        "characterId": "thalion",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "karn",
              "expected": false
            },
            {
              "type": "culpritStatAbove",
              "stat": "intelligence",
              "characterId": "mira",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "karn",
        "predicate": {
          "type": "culpritIs",
          "characterId": "brumm",
          "expected": true
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritStatAbove",
              "stat": "intelligence",
              "characterId": "mira",
              "expected": true
            },
            {
              "type": "culpritStatAbove",
              "stat": "strength",
              "characterId": "thalion",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "elara",
          "expected": false
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "mira",
          "expected": true
        }
      },
      {
        "characterId": "neris",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritStatAbove",
              "stat": "intelligence",
              "characterId": "mira",
              "expected": true
            },
            {
              "type": "culpritStatAtLeast",
              "stat": "strength",
              "value": 10,
              "expected": false
            }
          ]
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
    "id": "desert-2",
    "difficulty": "expert",
    "characterIds": [
      "aldric",
      "thalion",
      "sombrelame",
      "elara",
      "pip",
      "brumm",
      "karn"
    ],
    "statements": [
      {
        "characterId": "aldric",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "characterTruth",
              "characterId": "karn",
              "expected": false
            },
            {
              "type": "culpritStatAtLeast",
              "stat": "intelligence",
              "value": 8,
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritIs",
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
              "type": "culpritStatAtLeast",
              "stat": "intelligence",
              "value": 9,
              "expected": true
            },
            {
              "type": "culpritAlignment",
              "alignment": "pacifiste",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "pacifiste",
          "expected": true
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "aldric",
          "expected": true
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 10,
          "expected": true
        }
      },
      {
        "characterId": "karn",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 9,
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "truthCount",
        "count": 4
      }
    ]
  },
  {
    "id": "desert-3",
    "difficulty": "expert",
    "characterIds": [
      "thalion",
      "ondine",
      "pip",
      "elara",
      "mira",
      "aldric",
      "sombrelame"
    ],
    "statements": [
      {
        "characterId": "thalion",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "elara",
          "expected": true
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "strength",
          "value": 7,
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritAlignment",
              "alignment": "pacifiste",
              "expected": false
            },
            {
              "type": "culpritStatAbove",
              "stat": "intelligence",
              "characterId": "mira",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritStatAbove",
              "stat": "intelligence",
              "characterId": "pip",
              "expected": true
            },
            {
              "type": "culpritIs",
              "characterId": "aldric",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "characterTruth",
          "characterId": "thalion",
          "expected": false
        }
      },
      {
        "characterId": "aldric",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 7,
          "expected": true
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "vengeur",
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
    "id": "ombres-1",
    "difficulty": "expert",
    "characterIds": [
      "aldric",
      "mira",
      "brumm",
      "sombrelame",
      "pip",
      "thalion",
      "ondine"
    ],
    "statements": [
      {
        "characterId": "aldric",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritStatAbove",
              "stat": "strength",
              "characterId": "sombrelame",
              "expected": false
            },
            {
              "type": "characterTruth",
              "characterId": "thalion",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "mira",
        "predicate": {
          "type": "culpritAlignment",
          "alignment": "pacifiste",
          "expected": true
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "culpritIs",
          "characterId": "brumm",
          "expected": false
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "culpritIs",
          "characterId": "ondine",
          "expected": false
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
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "ondine",
          "expected": true
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
        "type": "truthCount",
        "count": 4
      }
    ]
  },
  {
    "id": "ombres-2",
    "difficulty": "expert",
    "characterIds": [
      "aldric",
      "elara",
      "thalion",
      "sombrelame",
      "ondine",
      "gorak",
      "pip",
      "varek"
    ],
    "statements": [
      {
        "characterId": "aldric",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "varek",
              "expected": false
            },
            {
              "type": "culpritStatAtLeast",
              "stat": "intelligence",
              "value": 6,
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 6,
          "expected": false
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritIs",
            "characterId": "elara",
            "expected": false
          }
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritStatAtLeast",
              "stat": "strength",
              "value": 4,
              "expected": false
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
        "characterId": "ondine",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritIs",
              "characterId": "ondine",
              "expected": true
            },
            {
              "type": "culpritAlignment",
              "alignment": "pacifiste",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "culpritStatAtLeast",
          "stat": "intelligence",
          "value": 5,
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "intelligence",
          "characterId": "aldric",
          "expected": false
        }
      },
      {
        "characterId": "varek",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritStatAbove",
              "stat": "strength",
              "characterId": "aldric",
              "expected": false
            },
            {
              "type": "culpritAlignment",
              "alignment": "belliqueux",
              "expected": false
            }
          ]
        }
      }
    ],
    "rules": [
      {
        "type": "truthCount",
        "count": 5
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
      "mira",
      "thalion",
      "elara",
      "brumm",
      "gorak",
      "sombrelame",
      "ondine",
      "pip"
    ],
    "statements": [
      {
        "characterId": "mira",
        "predicate": {
          "type": "characterTruth",
          "characterId": "thalion",
          "expected": false
        }
      },
      {
        "characterId": "thalion",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "culpritStatAtLeast",
              "stat": "strength",
              "value": 7,
              "expected": true
            },
            {
              "type": "culpritStatAbove",
              "stat": "intelligence",
              "characterId": "sombrelame",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "elara",
        "predicate": {
          "type": "not",
          "operand": {
            "type": "culpritStatAtLeast",
            "stat": "strength",
            "value": 4,
            "expected": true
          }
        }
      },
      {
        "characterId": "brumm",
        "predicate": {
          "type": "characterTruth",
          "characterId": "sombrelame",
          "expected": false
        }
      },
      {
        "characterId": "gorak",
        "predicate": {
          "type": "and",
          "operands": [
            {
              "type": "culpritStatAbove",
              "stat": "intelligence",
              "characterId": "ondine",
              "expected": true
            },
            {
              "type": "culpritStatAbove",
              "stat": "strength",
              "characterId": "gorak",
              "expected": false
            }
          ]
        }
      },
      {
        "characterId": "sombrelame",
        "predicate": {
          "type": "or",
          "operands": [
            {
              "type": "characterTruth",
              "characterId": "thalion",
              "expected": false
            },
            {
              "type": "characterTruth",
              "characterId": "ondine",
              "expected": true
            }
          ]
        }
      },
      {
        "characterId": "ondine",
        "predicate": {
          "type": "culpritIs",
          "characterId": "pip",
          "expected": false
        }
      },
      {
        "characterId": "pip",
        "predicate": {
          "type": "culpritStatAbove",
          "stat": "strength",
          "characterId": "ondine",
          "expected": true
        }
      }
    ],
    "rules": [
      {
        "type": "liarCountOneOf",
        "counts": [
          5,
          6
        ]
      }
    ]
  }
];
