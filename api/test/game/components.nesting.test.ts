import { test } from "tap";
import { component } from "../../src/game/components";
import { flatten } from "../../src/game/components.utils";

test("simple component nesting", async (t) => {
  const chara = component({
    id: "chara",
    initState: {
      name: "john",
      mana: component({
        id: "mana",
        initState: 10,
        effects: {},
        signals: {
          "-": (cost: number, prevState) => {
            return prevState - cost;
          },
        },
      }),
      statuses: ["bleeding"],
    },
    effects: {},
    signals: {
      cleanse: (a: null, prevState) => {
        prevState.mana.receive("-", 4);
        return { ...prevState, statuses: [] };
      },
    },
  });

  t.match(flatten(chara.state()), { mana: "10", statuses: ["bleeding"] });
  chara.receive("cleanse", null);
  t.match(flatten(chara.state()), { mana: "6", statuses: [] });
});
