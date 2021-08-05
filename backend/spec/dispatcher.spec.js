const Dispatcher = require("../shared/dispatcher");
const _ = require("lodash");
const A = require("../shared/actions");
// //--inspect-brk
const TEST_ACTION_1 = "TEST_ACTION_1";
const testAction1 = (arg) => ({type: TEST_ACTION_1, arg});

const TEST_ACTION_2 = "TEST_ACTION_2";
const testAction2 = () => ({type: TEST_ACTION_2});

describe("dispatcher", () => {
   let dispatcher;
   beforeEach(() => dispatcher = new Dispatcher());

   it("dispatches a simple action", () => {
       let action1Result;
       dispatcher.on(TEST_ACTION_1, action => {
           action1Result = action.arg;
       });

       dispatcher.emit(testAction1(42));

       expect(action1Result).toBe(42);
   });

   it("allows us to unsubscribe", () => {
       let count = 0;
       const sub = dispatcher.on(TEST_ACTION_1, () => count++);

       dispatcher.emit(testAction1(4));

       sub();

       dispatcher.emit(testAction1(1));

       expect(count).toBe(1);
   });

   it("allows object syntax for actions", () => {
       let action1count = 0;
       let action2count = 0;

       dispatcher.on({
           [TEST_ACTION_1]: () => action1count++,
           [TEST_ACTION_2]: () => action2count++
       });

       dispatcher.emit(testAction1(12));
       dispatcher.emit(testAction2());

       expect(action1count).toBe(1);
       expect(action2count).toBe(1);
   });

   it("allows us to subscribe with rxjs", () => {
       let action1Arg;
       dispatcher.on$(TEST_ACTION_1).subscribe(action => action1Arg = action.arg);

       dispatcher.emit(testAction1(42))

       expect(action1Arg).toBe(42);
   });
});