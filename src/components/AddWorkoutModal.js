import React, { useState } from "react";

const AddWorkoutModal = ({ token, onWorkoutAdded }) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const handleAddWorkout = async (e) => {
    e.preventDefault();

    const newWorkout = { name, duration, status };

    try {
      const response = await fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Workout added response:", data); 
        onWorkoutAdded(data); 
      } else {
        setMessage("Failed to add workout.");
      }
    } catch (error) {
      setMessage("Failed to add workout.");
      console.error("Error adding workout:", error);
    }
  };

  return (
    <div>
      <h2>Add a New Workout</h2>
      <form onSubmit={handleAddWorkout}>
        <input
          type="text"
          placeholder="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="not completed">Not Completed</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Add Workout</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddWorkoutModal;

