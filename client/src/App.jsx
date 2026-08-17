import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "./api";
import AuthForm from "./AuthForm.jsx";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);

  // apiFetch fires this event whenever the API rejects the current token
  // (expired/invalid) so we fall back to the login screen instead of
  // crashing on the error response.
  useEffect(() => {
    const handleUnauthorized = () => setToken(null);
    window.addEventListener("devflow:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("devflow:unauthorized", handleUnauthorized);
  }, []);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        apiFetch("/projects"),
        apiFetch("/tasks")
      ]);

      const projectsData = await projectsRes.json();
      const tasksData = await tasksRes.json();

      setProjects(projectsData);
      setTasks(tasksData);

      if (projectsData.length > 0) {
        setSelectedProject(projectsData[0]._id);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProjects([]);
    setTasks([]);
  };

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) return;

    await apiFetch("/projects", {
      method: "POST",
      body: JSON.stringify({
        name: projectName,
        description: "DevFlow project"
      })
    });

    setProjectName("");
    loadData();
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim() || !selectedProject) return;

    await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: taskTitle,
        project: selectedProject
      })
    });

    setTaskTitle("");
    loadData();
  };

  const updateTask = async (id, status) => {
    await apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });

    loadData();
  };

  const deleteTask = async (id) => {
    await apiFetch(`/tasks/${id}`, { method: "DELETE" });

    loadData();
  };

  if (!token) {
    return <AuthForm onAuthenticated={() => setToken(localStorage.getItem("token"))} />;
  }

  if (loading) {
    return <div className="loading">Loading DevFlow...</div>;
  }

  const completed = tasks.filter((task) => task.status === "DONE").length;

  return (
    <div className="app">
      <header>
        <div>
          <h1>DevFlow</h1>
          <p>Team Project & Issue Management</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <main>
        <section className="stats">
          <div className="card">
            <h3>Projects</h3>
            <strong>{projects.length}</strong>
          </div>

          <div className="card">
            <h3>Total Tasks</h3>
            <strong>{tasks.length}</strong>
          </div>

          <div className="card">
            <h3>Completed</h3>
            <strong>{completed}</strong>
          </div>
        </section>

        <section className="forms">
          <form onSubmit={createProject}>
            <h2>New Project</h2>

            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
            />

            <button>Create Project</button>
          </form>

          <form onSubmit={createTask}>
            <h2>New Task</h2>

            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
            />

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button>Create Task</button>
          </form>
        </section>

        <section>
          <h2>Projects</h2>

          <div className="project-grid">
            {projects.map((project) => (
              <div className="project-card" key={project._id}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Tasks</h2>

          <div className="tasks">
            {tasks.map((task) => (
              <div className="task" key={task._id}>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.project?.name}</p>
                </div>

                <select
                  value={task.status}
                  onChange={(e) => updateTask(task._id, e.target.value)}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>

                <button className="delete" onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
