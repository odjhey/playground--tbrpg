// POWER OF INFERENCE LEZGO!

export const component = <
  State,
  C extends Record<string, (p: any, s: State) => State>,
  E extends Record<string, [(s: State) => boolean, (s: State) => State]>
>(def: {
  id: string;
  initState: State;
  effects: E;
  signals: C;
}) => {
  let state = def.initState;

  return {
    receive: <K extends keyof typeof def.signals>(
      signal: K,
      props: Parameters<typeof def.signals[K]>[0]
    ) => {
      state = def.signals[signal](props, state);

      // TODO: effect priority and terminating effects
      //       maybe a middleware pattern is apt
      state = Object.keys(def.effects).reduce((accu, k) => {
        if (def.effects[k][0](accu)) {
          return def.effects[k][1](accu);
        }
        return accu;
      }, state);

      return state;
    },
    state: () => state,
  };
};

export type TComponentInstance = ReturnType<typeof component>;
