import "../../styles/components/InputBox.scss"
interface InputBoxProps{
    placeholder? : string,
    value? : string,
    changeEvent : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox:React.FC<InputBoxProps> = ({changeEvent, placeholder, value}) =>{
    return <input className="input_box_component_wrapper" type="text" onChange={changeEvent} placeholder={placeholder} value={value}/>
}

export default InputBox;