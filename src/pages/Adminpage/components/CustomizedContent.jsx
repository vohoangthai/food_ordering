import { AppstoreTwoTone, ShoppingTwoTone,  IdcardTwoTone, DatabaseTwoTone } from '@ant-design/icons'

const CustomizedContent = (props) => {
  const {data, colors, setKeySelected } = props
  return (
    <div style={{display: 'flex', gap: '40px', justifyContent: 'center'}}>
      {Object.keys(data) && Object.keys(data)?.map((item) => {
        return (
          <div 
          key={Math.random()} 
          style={{
            border: "1px solid ",
            color: "#333",
            width: 240,
            height: 160, 
            display: 'flex', 
            flexDirection: "column",
            gap: 20, 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
            onClick={() => setKeySelected(item)}
          >
            
            <p style={{fontSize: 25, fontWeight: 'bold', textTransform: 'uppercase',}}>
            <span style={{fontSize: 30, marginRight: 15}}>
              {item === 'users' && <IdcardTwoTone twoToneColor="#52c41a"/>}
              {item === 'products' && <AppstoreTwoTone twoToneColor="#f50539"/>}
              {item === 'warehouse' && <DatabaseTwoTone />}
              {item === 'orders' && <ShoppingTwoTone twoToneColor="#f57505"/>}
            </span>
              {item}</p>
            <span style={{fontSize: 25, fontWeight: 'bold', textTransform: 'uspanpercase'}}>{data[item]}</span>
          </div>
        )
      })}
    </div>
  );
};

export default CustomizedContent;