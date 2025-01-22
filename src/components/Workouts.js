import React, { useState, useEffect } from "react";
import AddWorkoutModal from "./AddWorkoutModal";
import Workouts from "./Workouts"; 

const App = () => {
  const [token, setToken] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddWorkout = (newWorkout) => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (token) {
        try {
          const response = await fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setWorkouts(data);  
          } else {
            console.error("Failed to fetch workouts.");
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      }
    };

    fetchWorkouts();
  }, [token]);

  return (
    <div>
      <h1>Fitness App</h1>

      {token ? (
        <div>
          <Workouts workouts={workouts} />
          <button onClick={() => setShowAddModal(true)}>Add Workout</button>
        </div>
      ) : (
        <div>
          {/* Render Login or Register components here */}
        </div>
      )}

      {showAddModal && (
        <AddWorkoutModal token={token} onWorkoutAdded={handleAddWorkout} />
      )}
    </div>
  );
};

export default App;
