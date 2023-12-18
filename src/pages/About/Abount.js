
import React, { useRef } from 'react'
import Navbar from '../../navbar';
import avrtar from '../../img/chef1.png';

const AboutPage = () => {
  
  return(
    <div>

    <Navbar></Navbar>
    <div>

    <div className='flex p-10'>
        <div className='w-[1400px]'><img className='w-[100%]]' src={avrtar} alt="" /></div>
        <div><h1 className='text-2xl text-orange-600 font-bold'>LỊCH SỬ HÌNH THÀNH
</h1>
        <p>GoFoods là một câu chuyện thành công phi thường bởi chỉ từ 2 tiệm kem nhỏ hình thành vào năm 1975, chuyên bán các món ăn nóng và bánh mì kẹp đã trở thành công ty với 7 cửa hàng vào năm 1978, chuyên về bơ gơ. Sau đó trở thành một tập đoàn tạo nên cuộc cách mạng thức ăn nhanh tại Philippines.
GoFoods hiện có hơn 1000 cửa hàng tại Philippines và hơn 300 cửa hàng tại các quốc gia trên khắp thế giới như Mỹ, Hong Kong, các tiểu vương quốc Ả Rập Thống Nhất, Qatar, Brunei, Trung Quốc, và Việt Nam.</p></div>
        
    </div>
    <div className='p-10'><h1 className='text-2xl text-orange-600 font-bold'>GoFoods VIỆT NAM
    </h1>
            <p>Cửa hàng GoFoods đầu tiên được mở tại Việt Nam vào năm 2005. Kể từ đó, GoFoods đã nỗ lực hết mình để mang đến các gia đình Việt những phần ăn ngon miệng với mức giá hợp lý.
Đến hôm nay, GoFoods đã có hơn 100 cửa hàng tại Việt Nam trải rộng trên toàn quốc. GoFoods không đơn thuần phục vụ những món thức ăn nhanh chất lượng theo quy trình được kiểm duyệt nghiêm khắc, mà còn mang đến cho mọi người không gian ấm áp, sang trọng để ai cũng được thưởng thức ẩm thực vui vẻ, thoải mái nhất bên gia đình và bè bạn. Từ những nền tảng này, GoFoods Việt Nam luôn ấp ủ trở thành thương hiệu thức ăn nhanh mang đến những món ăn ngon với hương vị phù hợp cho người Việt bên cạnh mục tiêu tạo ra một địa điểm ẩm thực góp phần gắn kết gia đình Việt qua bữa ăn ngon. Và đây cũng chính là tiền đề để GoFoods củng cố và phát triển bền vững trong dài hạn.</p></div>
    </div>
    </div>
  )

}

export default AboutPage