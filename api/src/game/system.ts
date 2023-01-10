import produce, { castDraft, Draft } from "immer";

type TTime = number;
type TState<T> = {
  value: T;
};

export type TEvents<T> = TEvent<T>[];
export type TEvent<T> = {
  // Domain/Object-type/Verb/Version
  topic: string;
  // Locality/SourceId/ObjectId
  props: string;
  value: T;
};

export type TWorld<T, E> = {
  time: TTime;
  state: TState<T>;
  events: TEvents<E>;
};

type TSystem<State, Event> = {
  tick: (tick: TTime, world: TWorld<State, Event>) => TWorld<State, Event>;
};

type TDeps<State, E> = {
  // TODO: make event type a union of literals
  // TODO: why do we need Draft here? `prevState: Draft<State>`
  consumers: Record<string, (e: TEvent<E>, prevState: Draft<State>) => State>;
};

export function system<StateV, E>(
  deps: TDeps<TState<StateV>, E>
): TSystem<StateV, E> {
  return {
    tick: (t, w) => {
      const nw = produce(w, (d) => {
        // consume events

        w.events.map((e) => {
          const consume = deps.consumers[e.topic];

          if (typeof consume === "function") {
            d.state = castDraft(consume(e, d.state));
          }
        });

        d.time = d.time + t;
      });

      return nw;
    },
  };
}
