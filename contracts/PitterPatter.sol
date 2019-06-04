pragma solidity ^0.5.1;

import "./StringExamples.sol";

contract PitterPatterAssessor is SpecificAPIAssessor {
  // Idea for assessment:
    // 1. Using the git key
      // - the proof a person claiming to have done the job submits is a hash signed with their git private key
      // - completer pushes using that key
      // - the assess() compares the hash of the submission which made the tests pass with the claim hash
      // and determines whether they used the same private key
      // - pros:
      // - cons:
    // 2. Deductive style
      // - the proof a person claiming to have done the job submits is a timestamp of when the tests will start passing
      // - completer waits to push until the submitted claim time
      // - the assess() queries the api for the timestamp that the tests starting passing on and compares claims
  // TODO override respond() to use an internal method, assess, that
  // figures out whether a claimed response is valid completion of its job
}
