import { test } from "tap";
import { component } from "../../src/game/components";
import { systemx } from "../../src/game/systemx";

test("basic system of components", async (t) => {
  const events = [
    { event: "atk", source: "1", target: "2", props: { value: 3 } } as const,
    { event: "atk", source: "2", target: "1", props: { value: 8 } } as const,
  ];

  const makeChar = (id: string, stats: { hp: number }) => {
    return component({
      id,
      effects: {},
      initState: stats,
      signals: {
        damage: (amt: number, s) => {
          return { ...s, hp: s.hp - amt };
        },
      },
    });
  };

  const chara1 = makeChar("chara1", { hp: 90 });
  const chara2 = makeChar("chara2", { hp: 82 });

  const wy = systemx({
    components: {
      chara1,
      chara2,
    },
    eventsDefinition: {
      atk: {
        toSignals: (e: { props: { damage: number } }) => {
          return [["damage" as const, e.props.damage]];
        },
      },
    },
  });

  const e = events[0];
  // wy.send(e, { source: e.source, target: e.target });
  wy.send(e, { props: { damage: e.props.value } });

  t.match({ chara1: { hp: 87 }, chara2: { hp: 79 } }, wy.render());
});
