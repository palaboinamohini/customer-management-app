import {BrowserRouter,Routes,Route} from 'react-router-dom'
import CustomerListPage from './Pages/CustomerListPage'
import CustomerDetailPage from './Pages/CustomerDetailPage'
import CustomerFormPage from './Pages/CustomerFormPage'
import './App.css'

const App = () => (
  <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<CustomerListPage />} />
        <Route exact path="/customers/new" element={<CustomerFormPage />} />
        <Route exact path="/customers/:id" element={<CustomerDetailPage />} />
        <Route exact path="/customers/:id/edit" element={<CustomerFormPage />} />
      </Routes>
  </BrowserRouter>
)
export default App
