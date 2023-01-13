import { TComponentInstance } from "./components";

export function systemx<
  Components extends Record<string, TComponentInstance>,
  EventsDefinition extends Record<
    string,
    {
      toSignals: (
        e: any
      ) => Parameters<Components[keyof Components]["receive"]>[];
    }
  >
>(def: { components: Components; eventsDefinition: EventsDefinition }) {
  return {
    send: (
      event: { event: keyof EventsDefinition },
      p: Parameters<EventsDefinition[keyof EventsDefinition]["toSignals"]>[0]
    ) => {
      const keys = Object.keys(def.components);
      keys.forEach((k) => {
        const signals = def.eventsDefinition[event.event].toSignals(p);

        // TODO: need ordering?
        signals.forEach((s) => def.components[k].receive(s[0], s[1]));
      }, {});
    },
    render: () => {
      const ck = Object.keys(def.components);
      const states = ck.map((k) => {
        return [k, def.components[k].state()];
      });
      return Object.fromEntries(states);
    },
  };
}
