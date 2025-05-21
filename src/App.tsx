import { Route, Routes } from 'react-router-dom';
import { BaseLayout } from './layout';
import { CartProvider } from './contexts/CartContext';
import { CartPage } from './pages/Cart/CartPage';
import { HomePage } from './pages/Home/HomePage';
import { ProductProvider } from './contexts/ProductContext';
import { OrderProvider } from './contexts/OrderContext';
import { Profile } from './components/Profile/Profile';

function App() {
  return (
    <BaseLayout>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/cart" element={<CartPage/>} />
              <Route path="/profile" element={<Profile/>}/>
            </Routes>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </BaseLayout>
  )
}

export default App
