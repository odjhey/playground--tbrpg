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

type TWorld<T, E = unknown> = {
  time: TTime;
  state: TState<T>;
  events: TEvents<E>;
};

type TSystem<T> = {
  tick: (tick: TTime, world: TWorld<T>) => TWorld<T>;
};

type TDeps = {};

export function system<State>(w: TWorld<State>, deps: TDeps): TSystem<State> {
  return {
    tick: (t, w) => {
      return { ...w, time: w.time + t };
    },
  };
}
