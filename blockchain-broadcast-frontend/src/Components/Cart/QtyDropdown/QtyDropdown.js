import "./QtyDropdown.css";
import CustomSelect from "../../CustomSelect/CustomSelect";

const QtyDropdown = ({ item, qtyChangeHandler }) => {
    const arr = Array.from({ length: 100 }, (_, index) => index + 1);
    const items = arr.reduce((a, v) => ({ ...a, [v]: v }), {});

    return (
        <CustomSelect
            inputLabelId="qty-select-label"
            labelId="SelectQty"
            id="select"
            value={item.qty}
            handleChange={(e) => qtyChangeHandler(item.book, e.target.value)}
            items={items}
        />
    );
};

export default QtyDropdown;
