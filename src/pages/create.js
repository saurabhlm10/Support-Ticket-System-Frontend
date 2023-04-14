import React, { useState } from "react";

const create = () => {
  const [handlersArray, setHandlersArray] = useState([]);

  const tempHandlers = ['Manish', 'Shubham', 'Saurabh', 'Jaydev']

  return (
    <div>
      <h1 className="text-4xl text-center">Create Ticket</h1>
      <div>
        <h1>Student Details</h1>
        <div>
          <label htmlFor="studentName">Student Name</label>
          <input type="text" name="studentName" className="border-2" />
        </div>
        <div>
          <label htmlFor="studentEmail">Student Email</label>
          <input type="text" name="studentEmail" className="border-2" />
        </div>

        <div>
          <label htmlFor="studentPhone">Student Phone</label>
          <input type="text" name="studentPhone" className="border-2" />
        </div>

        <div>
          <label htmlFor="issueType">Issue Type</label>

          <select name="issueType" className="border-2">
            <option value="No Access">No Access</option>
            <option value="Batch Change">Batch Change</option>
            <option value="Assignment">Assignment</option>
            <option value="Other">Other</option>
          </select>
        </div>

      <div>
      <label htmlFor="handler">Handler</label>

        <input type="text" name="handler" className="border-2"/>
        {/* <div className="border-2">
          {tempHandlers.map((handler) => (
            <div>
              {handler}
            </div>
          ))}
        </div> */}
      </div>

      </div>
    </div>
  );
};

export default create;
