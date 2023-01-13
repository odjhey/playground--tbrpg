export function isComponent(
  state: Record<any, any>
): state is Record<any, any> {
  return typeof state === "object";
}

export const flatten = (state: any) => {
  if (isComponent(state)) {
    const keys = Object.keys(state) as (keyof typeof state)[];
    const values = keys.map((k) => {
      if (typeof state[k]["state"] === "function") {
        return flatten(state[k]["state"]());
      }
      return state[k];
    });
    return keys.reduce((accu, k, idx) => {
      accu[k] = values[idx];
      return accu;
    }, {});
  }

  return state;
};
