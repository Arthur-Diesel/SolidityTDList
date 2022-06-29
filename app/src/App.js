import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { CONTACT_ABI, CONTACT_ADDRESS } from './config'

function App() {

  const [account, setAccount] = useState();
  const [taskList, setTaskList] = useState();
  const [tasks, setTasks] = useState([]);
  
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

  async function changeTaskStatus(id){
    await taskList.methods.toggleCompleted(id).send({from: account});
    setTasks([])
    getTasks()
  }

  return (
    <>
      <div className='w-100 text-center my-3'>
        <h1>Hello World!</h1>
        <p>Account: {account}</p>
      </div>
      <div className='w-100'>
        {tasks?.map((task, index) => {
          return(
            <div className="container" key={task[0]}>
              <p>ID: {task[0]}</p>
              <p>Content: {task[1]}</p>
              <p>Completed: {task[2] === false ? 'No' : 'Yes'} <button className='btn btn-primary' onClick={e => changeTaskStatus(task[0])}>Alterar</button></p>
            </div>
          )
        })}
      </div>
    </>
  );
}

export default App;
