import React, { useContext, useState, useEffect, useMemo } from "react";
import CodeEditorContext from "../../context/CodeEditorContext";
import { useParams } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import SubmitReport from "./SubmitReport";

const SubmitResut = () => {
  const { submitOutput, submitResponse } = useContext(CodeEditorContext);
  const { problems } = useContext(GlobalContext);

  const { problemId } = useParams();
  const [showAccepted, setShowAccepted] = useState(false);
  const [accepted, setAccepted] = useState(false);

  let problemIndex = 0;
  for (let i = 0; i < problems.length; i++) {
    if (problems[i].id === parseInt(problemId)) {
      problemIndex = i;
      break;
    }
  }
  const problem = problems[problemIndex]?.submitOutput;
  const arr1 = problem.split("\n");

  const func = () => {
    let res = new Array(arr1.length).fill(0);
    if (!submitOutput?.output?.includes("\n")) return res;
    if (submitOutput?.output.includes("error")) return res;
    const arr2 = submitOutput.output.split("\n");
    for (let i = 0; i < arr1.length; i++) {
      let str1 = arr1[i],
        str2 = arr2[i],
        str3,
        str4;
      if (str1 && str1.includes(" ")) {
        str3 = str1.replaceAll(" ", "");
      }
      if (str2 && str2.includes(" ")) {
        str4 = str2.replaceAll(" ", "");
      }
      if (str3 === str4) {
        res[i] = 1;
      }
    }
    return res;
  };

  // Use useMemo to calculate the results only when submitOutput changes
  const resultArray = useMemo(() => func(), [submitOutput]);

  // Use useEffect to check the correct count after rendering
  useEffect(() => {
    const correctCount = resultArray.filter(value => value === 1).length;
    if (correctCount === 5) {
      setAccepted(true);
      setShowAccepted(true);
    }
  }, [resultArray]);

  return (
    <>
      <div className="whitespace-pre-line">
        {submitResponse ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <>
            {submitOutput?.output ? (
              resultArray.map((value, index) => (
                <div key={index}>
                  Test Case {index + 1}
                  {value === 1 ? (
                    <img
                      className="w-5 h-5 m-2 inline"
                      src="/correct.png"
                      alt="correct"
                    />
                  ) : (
                    <img
                      className="w-5 h-5 m-2 inline"
                      src="/wrong.png"
                      alt="wrong"
                    />
                  )}
                </div>
              ))
            ) : (
              <>No Submission Yet</>
            )}
          </>
        )}
      </div>
      <SubmitReport accepted={accepted} showAccepted={showAccepted} setShowAccepted={setShowAccepted} />
    </>
  );
};

export default SubmitResut;
