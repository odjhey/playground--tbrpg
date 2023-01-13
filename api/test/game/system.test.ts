import { test } from "tap";
import { component } from "../../src/game/components";
import { system } from "../../src/game/system";

test("basic system of components", async (t) => {
  const events = [
    {
      event: "atk",
      source: "1",
      target: "chara2",
      props: { value: 3 },
    } as const,
    {
      event: "atk",
      source: "2",
      target: "chara1",
      props: { value: 8 },
    } as const,
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

  const components = {
    chara1,
    chara2,
  };
  const wy = system({
    components,
    eventsDefinition: {
      atk: {
        toSignals: (e: {
          props: { damage: number; target: keyof typeof components };
        }) => {
          return [
            {
              signal: ["damage" as const, e.props.damage],
              selector: () => [e.props.target],
            },
          ];
        },
      },
    },
  });

  events.forEach((e) =>
    wy.send(e, { props: { damage: e.props.value, target: e.target } })
  );

  t.match({ chara1: { hp: 82 }, chara2: { hp: 79 } }, wy.render());
});
