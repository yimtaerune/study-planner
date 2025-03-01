import React, { useState } from "react";

const getSeasonEmoji = (month) => {
  if ([12, 1, 2].includes(month)) return "❄️"; // 겨울
  if ([3, 4, 5].includes(month)) return "🌸"; // 봄
  if ([6, 7, 8].includes(month)) return "☀️"; // 여름
  return "🍁"; // 가을
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [studyData, setStudyData] = useState({});
  const [nickname, setNickname] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const month = new Date().getMonth() + 1;

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleSave = (date, tasks, diary) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = Math.round((completedTasks / tasks.length) * 10) || 0;

    setStudyData(prevData => ({
      ...prevData,
      [date]: { progress, tasks, diary },
    }));
    setSelectedDate(null);
  };

  const handleLogin = () => {
    if (nickname.trim()) {
      setLoggedIn(true);
    }
  };

  if (!loggedIn) {
    return (
      <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-extrabold text-blue-700 font-serif">Study Planner</h1>
        <input
          type="text"
          placeholder="Enter Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 rounded-md mt-4"
        />
        <button onClick={handleLogin} className="mt-2 p-2 bg-blue-500 text-white rounded-md">
          Login
        </button>
      </div>
    );
  }

  if (selectedDate) {
    return <StudyDetails date={selectedDate} data={studyData[selectedDate]} onSave={handleSave} onBack={() => setSelectedDate(null)} />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 font-serif">📅 Study Planner</h1>
      <h2 className="text-lg font-semibold mt-4 text-center">{getSeasonEmoji(month)} {month}월 {getSeasonEmoji(month)}</h2>
      <div className="grid grid-cols-7 gap-2 mt-4">
        {[...Array(30)].map((_, i) => {
          const date = i + 1;
          const progress = studyData[date]?.progress || 0;
          return (
            <div
              key={date}
              className="p-4 border rounded-lg cursor-pointer bg-white shadow-md hover:bg-blue-100 transition"
              onClick={() => handleDateClick(date)}
            >
              <div className="text-center font-bold text-gray-700">{date}일</div>
              <div className="flex justify-center mt-2 text-lg">
                {progress === 10 ? "😆" : progress >= 7 ? "😊" : progress >= 4 ? "🙂" : "😐"}
              </div>
              <div className="flex justify-center mt-1">
                🌼 {[...Array(10)].map((_, j) => (
                  <span key={j} className={j < progress ? "text-yellow-400" : "text-gray-300"}>⬤</span>
                ))} 🌼
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StudyDetails = ({ date, data, onSave, onBack }) => {
  const [tasks, setTasks] = useState(data?.tasks || [{ subject: "", text: "", completed: false }]);
  const [diary, setDiary] = useState(data?.diary || "");

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleTaskCheck = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { subject: "", text: "", completed: false }]);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <button onClick={onBack} className="mb-4 p-2 bg-gray-300 rounded-md">← Back</button>
      <h2 className="text-lg font-bold">{date}일 Study Log 📝</h2>
      <label className="block mt-2">📌 Study Plan:</label>
      {tasks.map((task, index) => (
        <div key={index} className="flex items-center mt-1 space-x-2">
          <input
            type="text"
            value={task.subject}
            onChange={(e) => handleTaskChange(index, "subject", e.target.value)}
            placeholder="Subject"
            className="border p-1 w-1/4 rounded-md"
          />
          <input
            type="text"
            value={task.text}
            onChange={(e) => handleTaskChange(index, "text", e.target.value)}
            placeholder="Study Details"
            className="border p-1 w-1/2 rounded-md"
          />
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleTaskCheck(index)}
            className="mr-2"
          />
        </div>
      ))}
      <button onClick={addTask} className="mt-2 p-1 bg-gray-300 rounded-md">+ Add</button>
      <label className="block mt-2">✍️ 3-Line Diary:</label>
      <textarea
        value={diary}
        onChange={(e) => setDiary(e.target.value)}
        className="border p-2 w-full rounded-md"
        rows="3"
      ></textarea>
      <button
        onClick={() => onSave(date, tasks, diary)}
        className="mt-2 p-2 bg-blue-500 text-white rounded-md"
      >
        Save 💾
      </button>
    </div>
  );
};

export default Calendar;
