export interface MachineDedinition<
  MachineStates extends string,
  MachineEvents extends string
> {
  initialState: MachineStates;

  states: {
    [MachineState in MachineStates]?: {
      actions?: {
        onEnter?: () => void;
        onExit?: () => void;
      };
      transitions?: {
        [MachineEvent in MachineEvents]?: {
          target?: MachineStates;
          action?: () => void;
        };
      };
    };
  };
}

export interface Machine<T, U> {
  state: T;
  subscriptions: Set<Function>;
  subscribe(fn: Function): () => void;
  notify(): void;
  send(event: U): void;
  transition(event: U): {
    state: T;
    change: boolean;
  };
}

/**
 * 创建状态机
 * 
 * @example
import { createMachine } from "@cyhfe/toolkit";
import { MachineDedinition } from "@cyhfe/toolkit/dist/es/createMachine";

enum MachineStates {
  ON = "on",
  OFF = "off",
}

enum MachineEvents {
  TOGGLE = "toggle",
}

const machineChart: MachineDedinition<MachineStates, MachineEvents> = {
  initialState: MachineStates.OFF,
  states: {
    [MachineStates.OFF]: {
      actions: {
        onEnter() {
          console.log("enter off");
        },
        onExit() {
          console.log("exit off");
        },
      },
      transitions: {
        [MachineEvents.TOGGLE]: {
          target: MachineStates.ON,
          action() {
            console.log("from off to on");
          },
        },
      },
    },
    [MachineStates.ON]: {
      actions: {
        onEnter() {
          console.log("enter on");
        },
        onExit() {
          console.log("exit on");
        },
      },
      transitions: {
        [MachineEvents.TOGGLE]: {
          target: MachineStates.OFF,
          action() {
            console.log("from on to off");
          },
        },
      },
    },
  },
};

const machine = createMachine(machineChart);

machine.subscribe(() => console.log(machine.state));

machine.send(MachineEvents.TOGGLE);

// exit off
// from off to on
// enter on
// on

 * @param machineDedinition
 * @returns
 */
export function createMachine<
  MachineStates extends string,
  MachineEvents extends string
>(
  machineDedinition: MachineDedinition<MachineStates, MachineEvents>
): Machine<MachineStates, MachineEvents> {
  let machine = {
    state: machineDedinition.initialState,
    subscriptions: new Set<Function>([]),
    subscribe(fn: Function) {
      this.subscriptions.add(fn);
      return () => {
        this.subscriptions.delete(fn);
      };
    },
    notify() {
      this.subscriptions.forEach((cb) => cb());
    },

    send(event: MachineEvents) {
      let { change } = this.transition(event);
      if (change) {
        this.notify();
      }
    },

    transition(event: MachineEvents) {
      const currentState = this.state;
      const nextState =
        machineDedinition.states[currentState]?.transitions?.[event]?.target;

      if (!nextState) {
        return {
          state: currentState,
          change: false,
        };
      }

      machineDedinition.states[currentState]?.actions?.onExit?.();
      this.state = nextState;
      machineDedinition.states[currentState]?.transitions?.[event]?.action?.();
      machineDedinition.states[nextState]?.actions?.onEnter?.();
      return {
        state: this.state,
        change: true,
      };
    },
  };
  return machine;
}
