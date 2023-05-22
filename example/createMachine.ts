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
