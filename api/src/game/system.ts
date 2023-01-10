import produce from "immer";

type TTime = number;
type TState<T> = {
  value: T;
};

export type TEvents<T> = {
  // Domain/Object-type/Verb/Version
  topic: string;
  // Locality/SourceId/ObjectId
  props: string;
  value: T;
}[];

export type TWorld<T, E> = {
  time: TTime;
  state: TState<T>;
  events: TEvents<E>;
};

type TSystem<State, Event> = {
  tick: (tick: TTime, world: TWorld<State, Event>) => TWorld<State, Event>;
};

type TDeps = {};

export function system(deps: TDeps): TSystem<number, number> {
  return {
    tick: (t, w) => {
      const nw = produce(w, (d) => {
        // consume events

        w.events.map((e) => {
          if (
            typeof e.value === "number" &&
            typeof w.state.value === "number"
          ) {
            w.state.value = w.state.value + e.value;
          }
        });

        d.time = d.time + t;
      });

      return nw;
    },
  };
}
