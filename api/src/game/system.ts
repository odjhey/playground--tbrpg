import { TComponentInstance } from "./components";
import { flatten } from "./components.utils";

export function system<
  Components extends Record<string, TComponentInstance>,
  EventsDefinition extends Record<
    string,
    {
      toSignals: (e: any) => {
        signal: Readonly<Parameters<Components[keyof Components]["receive"]>>;
        selector: () => (keyof Components)[];
      }[];
    }
  >
>(def: { components: Components; eventsDefinition: EventsDefinition }) {
  return {
    send: (
      event: { event: keyof EventsDefinition },
      p: Parameters<EventsDefinition[keyof EventsDefinition]["toSignals"]>[0]
    ) => {
      const signals = def.eventsDefinition[event.event].toSignals(p);
      // TODO: need ordering?
      signals.forEach((s) => {
        s.selector().forEach((c) =>
          def.components[c].receive(s.signal[0], s.signal[1])
        );
      });
    },
    render: () => {
      const ck = Object.keys(def.components);
      const states = ck.map((k) => {
        console.log("---sate", k, def.components[k].state());
        return [k, flatten(def.components[k].state())];
      });
      return Object.fromEntries(states);
    },
  };
}
