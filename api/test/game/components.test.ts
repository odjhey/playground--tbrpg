import { test } from "tap";
import { component } from "../../src/game/components";

test("simple component state", async (t) => {
  const hpComponent = component({
    id: "hp",
    initState: 0,
    effects: {},
    signals: {
      "+": (a: number, prevState) => {
        return prevState + a;
      },
      "-": (a: number, prevState) => {
        return prevState - a;
      },
    },
  });

  hpComponent.receive("+", 1);

  t.match(hpComponent.state(), 1);
});

test("object component state", async (t) => {
  const chara = component({
    id: "chara",
    initState: { name: "john", hp: 10 },
    effects: {},
    signals: {
      "+": (a: number, prevState) => {
        return { ...prevState, hp: prevState.hp + a };
      },
    },
  });

  chara.receive("+", 1);
  t.match(chara.state(), { name: "john", hp: 11 });
});

test("simple component effects - exec", async (t) => {
  const chara = component({
    id: "chara",
    initState: { name: "john", hp: 10, active: true },
    effects: {
      die: [
        (state) => state.hp < 0,
        (state) => {
          return { ...state, active: false };
        },
      ],
    },
    signals: {
      "-": (a: number, prevState) => {
        return { ...prevState, hp: prevState.hp - a };
      },
    },
  });

  chara.receive("-", 888);
  t.match(chara.state(), { name: "john", active: false });
});

test("simple component effects - not exec", async (t) => {
  const chara = component({
    id: "chara",
    initState: { name: "john", hp: 10, active: true },
    effects: {
      die: [
        (state) => state.hp < 0,
        (state) => {
          return { ...state, active: false };
        },
      ],
    },
    signals: {
      "-": (a: number, prevState) => {
        return { ...prevState, hp: prevState.hp - a };
      },
    },
  });

  chara.receive("-", 1);
  t.match(chara.state(), { name: "john", active: true });
});
