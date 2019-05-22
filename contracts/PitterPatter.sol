pragma solidity ^0.5.1;

import "./StringExamples.sol";

// This is the contract where people submit freelance jobs on PitterPatter and
// incentivisers hook into to evaluate claims and decide how to move escrow
contract PitterPatterAssessor is JSONInstruction {
  // TODO override respond() to use an internal method, assess, that
  // figures out whether a claimed response is valid completion of its job
}
