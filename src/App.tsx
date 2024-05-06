import { Routes, Route } from 'react-router-dom'
import IndexPage from './pages/indexPage';
import Signup from './components/signup';
import Login from './components/Login';
import { ShopPage } from './pages/shop';
import MyItems from './pages/MyItems';
import AddItems from './pages/AddItems';
import EditItem from './pages/EditItem';
import Account from './pages/Account';
function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path='/shop' element={<ShopPage />} />
      <Route path='*' element={<ShopPage />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/myitems' element={<MyItems />} />
      <Route path='/myitems/additems' element={<AddItems />} />
      <Route path='/myitems/edit/:id' element={<EditItem />} />
      <Route path='/account' element={<Account />} />
    </Routes>
  );
}

export default App;
