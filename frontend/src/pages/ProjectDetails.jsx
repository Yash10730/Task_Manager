import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, UserPlus, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  // Forms state
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium', status: 'To Do', assignedTo: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/projects/${id}/tasks`);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/tasks`, newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'To Do', assignedTo: '' });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: newMemberEmail });
      setShowMemberModal(false);
      setNewMemberEmail('');
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member?')) {
      try {
        await api.delete(`/projects/${id}/members/${memberId}`);
        fetchProjectDetails();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/projects/${id}/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/projects/${id}/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) return <div className="loader">Loading Project...</div>;
  if (!project) return <div className="error">Project not found</div>;

  const isAdmin = project.admin._id === user._id;
  
  // Group tasks by status
  const columns = ['To Do', 'In Progress', 'Done'];
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status);
    return acc;
  }, {});

  return (
    <div className="page-container project-details">
      <div className="page-header">
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="project-desc">{project.description}</p>
        </div>
        {isAdmin && (
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => setShowMemberModal(true)}>
              <UserPlus size={18} /> Add Member
            </button>
            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={18} /> New Task
            </button>
          </div>
        )}
      </div>

      <div className="members-section" style={{ marginBottom: '2rem' }}>
        <h3>Team Members</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <span className="assigned-badge">👑 {project.admin.name} (Admin)</span>
          {project.members.map(member => (
            <span key={member._id} className="assigned-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {member.name}
              {isAdmin && (
                <button 
                  onClick={() => handleRemoveMember(member._id)} 
                  style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1rem', lineHeight: '1' }}
                >
                  &times;
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="kanban-board">
        {columns.map(status => (
          <div key={status} className="kanban-column">
            <h3 className="column-title">{status} <span>({tasksByStatus[status].length})</span></h3>
            <div className="task-list">
              {tasksByStatus[status].map(task => (
                <div key={task._id} className={`task-card priority-${task.priority}`}>
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(task._id)} className="btn-icon text-danger">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-meta">
                    {task.assignedTo && <span className="assigned-badge">{task.assignedTo.name}</span>}
                    {task.dueDate && <span className="date-badge">{new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                  
                  {/* Status update select */}
                  <select 
                    className="status-select"
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    disabled={!isAdmin && (!task.assignedTo || task.assignedTo._id !== user._id)}
                  >
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members.map(member => (
                    <option key={member._id} value={member._id}>{member.name}</option>
                  ))}
                  <option value={project.admin._id}>{project.admin.name} (Admin)</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>User Email</label>
                <input type="email" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
