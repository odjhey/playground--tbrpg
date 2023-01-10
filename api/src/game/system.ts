type TTime = number;
type TState<T> = {
  value: T;
};
type TEvents<T> = { name: string; props: T }[];

type TWorld<T> = {
  time: TTime;
  state: TState<T>;
  events: TEvents<unknown>;
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
