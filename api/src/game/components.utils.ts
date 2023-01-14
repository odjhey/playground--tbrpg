export function isComponent(
  state: Record<any, any>
): state is Record<any, any> {
  return typeof state === "object" && typeof state["state"] === "function";
}

export function isObject(state: Record<any, any>): state is Record<any, any> {
  return typeof state === "object";
}

export function isArray(state: any): state is any[] {
  return Array.isArray(state);
}

export const flatten = (state: any) => {
  const flattenObj = (state: Record<any, any>) => {
    const keys = Object.keys(state) as (keyof typeof state)[];
    const values = keys.map((k) => {
      if (isComponent(state[k])) {
        return flatten(state[k]["state"]());
      }
      if (isArray(state[k])) {
        return flatten(state[k]);
      }
      return state[k];
    });

    // TODO: could be replaced by Object.fromEntries?
    return keys.reduce((accu, k, idx) => {
      accu[k] = values[idx];
      return accu;
    }, {});
  };

  if (isArray(state)) {
    return state.map((s) => {
      if (isComponent(s)) {
        return s["state"]();
      }
      // TODO: find a way to have `s` not start as any,
      //       we dont get ts error when using `any`,
      //       meaning flattenObj will not complain even if we don't wrap it with `isComp`
      if (isObject(s)) {
        return flattenObj(s);
      }
      return s;
    });
  }

  if (isObject(state)) {
    return flattenObj(state);
  }

  return state;
};
