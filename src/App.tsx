import React, {useState, useRef} from 'react';
import axios from 'axios';
import './App.css';

interface User {
  attributes: {
    id: number;
    name: string;
    account_ids: any
  }
}

interface Account {
  attributes: {
    id: number;
    user_id: number;
    name: string;
    balance: number
  }
}

const api = 'https://sample-accounts-api.herokuapp.com';

const App: React.FC = () => {

  const [users, setUsers] = useState<User>({
    attributes: {
      id: 0,
      name: '',
      account_ids: ''
    }
  });

  const [accounts, setAccounts] = useState<Account[]>([]);

  const textInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]: [boolean,(loading: boolean) => void] = useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] = useState('');

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const userId = textInputRef.current!.value;

      axios
        .get<User>(api + '/users/' + userId, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        })
        .then((response) => {
          setUsers(response.data);
          handleAccountBalance(userId);
          setLoading(false);
        })
        .catch((ex) => {
          setError('Resource not found');
          setLoading(false);
        });
  };

  const handleAccountBalance = (id: string) => {
    axios.get<Account[]>(api + '/users/' + id + '/accounts', {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    })
    .then((response) => {
      setAccounts(response.data);
      setLoading(false);
    })
    .catch((ex) => {
      setError('Resource not found');
      setLoading(false);
    });
  };


  return (
    <div className="App">
      <form onSubmit={handleSubmitForm}>
          <input type="text" id="user-id" ref={textInputRef} />
          <button type="submit">Submit</button>
      </form>
      {loading}

      <ul className="userList">
        {Object.values(users).map(user => (
          <><li key={user.id}>{user.name}</li>
            <ul>
              {Object.entries(accounts).map(([key, data]) => (
                <li key={data.attributes.id}>{data.attributes.name} - {data.attributes.balance}</li>
              ))}
            </ul></>
        ))}
      </ul>
      {error && <p className="error">{error}</p>}
    </div>
  );


  
};

export default App;
