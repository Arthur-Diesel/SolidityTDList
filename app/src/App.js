import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { CONTACT_ABI, CONTACT_ADDRESS } from './config'

function App() {

  const [account, setAccount] = useState();
  const [taskList, setTaskList] = useState();
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState('');
  
  useEffect(() => {
    async function load(){
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      const taskList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
      setTaskList(taskList)
      const amountOfTasks = await taskList.methods.taskCount().call()
      for(let x = 1; x <= amountOfTasks; x++){
        const task = await taskList.methods.tasks(x).call();
        setTasks((tasks) => [...tasks, task])
      }  
    }
    load()
  }, [])

  async function getTasks(){
    const amountOfTasks = await taskList.methods.taskCount().call()
    for(let x = 1; x <= amountOfTasks; x++){
      const task = await taskList.methods.tasks(x).call();
      setTasks((tasks) => [...tasks, task])
    }
  }

  function resetTasks(){
    setTasks([])
    getTasks()
  }

  async function changeTaskStatus(id){
    await taskList.methods.toggleCompleted(id).send({from: account});
    resetTasks()
  }

  async function addNewTask(){
    await taskList.methods.createTask(content).send({from: account});
    setContent('')
    resetTasks()
  }

  async function removeTask(id){
    await taskList.methods.removeTask(id).send({from: account});
    resetTasks()
  }

  return (
    <>
      <div className='w-100 text-center my-3'>
        <h1>To Do App!</h1>
        <p>Account: {account}</p>
      </div>
      <div className='container'>
        <h2 className='text-center'>New Task</h2>
        <form>
          <label htmlFor='content'>Content</label>
          <textarea className="form-control my-3" id="exampleFormControlTextarea1" rows={3} onChange={e => setContent(e.target.value)}></textarea>
          <button type="button" className="btn btn-primary" onClick={e => addNewTask()}>Submit</button>
        </form>
      </div>
      <div className='w-100'>
        {tasks?.map((task, index) => {
          if(task[0] !== '0'){
          return(
            <div className="container border border-dark rounded my-5 pt-3 pb-1 shadow shadow-lg" key={task[0]}>
              <p className='d-inline-block'>ID: {task[0]}</p>
              <button className='btn d-inline-block' onClick={e => removeTask(task[0])}><i className="bi bi-x-square"/></button>
              <p>Content: {task[1]}</p>
              <p className='d-inline-block'>Completed: {task[2] === false ? 'No' : 'Yes'}</p> 
              <button className='btn d-inline-block' onClick={e => changeTaskStatus(task[0])}><i className="bi bi-check-square" /></button>
            </div>
          )} else {
            return(null)
          }
        })}
      </div>
    </>
  );
}

export default App;
