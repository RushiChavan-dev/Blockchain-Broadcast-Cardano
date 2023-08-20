import "./CartIcon.css";
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { useSelector } from 'react-redux';

const CartIcon = () => {

    // Get Number of items in Shopping Cart
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const getCartCount = () => {
        return cartItems.filter(({ saved }) => saved !== true)
            .reduce((qty, item) => Number(item.qty) + qty, 0);
    };
    return (
        <>
            <div className="cartlogo_badge">{getCartCount()}</div>
            <ShoppingCartOutlinedIcon fontSize="small" />
        </>
    );
};

export default CartIcon;
