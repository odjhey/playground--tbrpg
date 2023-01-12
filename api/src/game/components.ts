// POWER OF INFERENCE LEZGO!

export const component = <
  State,
  C extends Record<string, (p: any, s: State) => State>
>(def: {
  id: string;
  initState: State;
  effects: Record<string, (state: State) => void>;
  signals: C;
}) => {
  let state = def.initState;

  return {
    receive: <K extends keyof typeof def.signals>(
      signal: K,
      props: Parameters<typeof def.signals[K]>[0]
    ) => {
      state = def.signals[signal](props, state);
      return state;
    },
    state: () => state,
  };
};
