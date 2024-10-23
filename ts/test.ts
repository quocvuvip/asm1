const URL_API = 'http://localhost:3000';
type Tdaubep = {
    id: number;
    tendb: string;
    chucvu:string;
    hinh: string;
    mota: string;
}
type Tsanpham={
    id: string;            // ID sản phẩm (kiểu chuỗi)
    tensp: string;         // Tên sản phẩm
    gia: number;           // Giá sản phẩm (kiểu số)
    mota: string;          // Mô tả sản phẩm
    giamgia: number;       // Giảm giá (phần trăm giảm giá, kiểu số)
    hinh: string;          // Đường dẫn đến hình ảnh sản phẩm
    loai: string;          // Loại sản phẩm (ví dụ: khaivi, combo, monchinh, hot,...)
    soLuongDaBan: number;  // Số lượng sản phẩm đã bán
    diemDanhGia: number;   // Điểm đánh giá trung bình của sản phẩm (1-5)
}

const hien1DB = (db: Tdaubep) => {
    return `<div class="chef-card">
                 <div class="box">
                    <div class="chef-image-wrapper">
                        <div class="circle-bg"></div>
                        <img src="${db.hinh}" alt="Chef 1" class="chef-photo">
                    </div>
                 </div>
                <div class="chef-info  box">
                    <h3>${db.tendb} </h3>
                    <h6>${db.chucvu}</h6>
                    <p>${db.mota}</p>
                </div>
            </div>`;
}

export const showlistdaubep = async () => {
    try {
        let response = await fetch(URL_API + "/daubep");
        if (!response.ok) {
            throw new Error("Có lỗi khi lấy dữ liệu từ API");
        }
        let listdaubep_arr: Tdaubep[] = await response.json();
        const daubephtlm_arr = listdaubep_arr.map(hien1DB);
        return daubephtlm_arr.join("");
    } catch (error) {
        console.error("Lỗi:", error);
        return `<div>Có lỗi xảy ra khi tải danh sách đầu bếp</div>`;
    }


}

const sphot = (sp:Tsanpham) =>{

    return ` <div class="product-card ">
                <div class="discount-tag">- ${sp.giamgia}</div>
                <img src="${sp.hinh}" alt="" class="product-image">
                <div class="product-info">
                    <h3>${sp.tensp}</h3>
                    <p class="price">
                        <span class="current-price">${sp.gia.toLocaleString()}₫</span>
                        <button class="buy-now-btn">Đặt Ngay</button>
                    </p>
                </div>
            </div>`;
}
const sphot2 = (sp:Tsanpham) =>{

    return ` <div class="product-card2">
                    <div class="product-image2">
                        <img src="${sp.hinh}" alt="">
                    </div>
                    <div class="product-details2">
                        <h3>${sp.tensp}</h3>
                        <div class="product-rating2">
                            <span>★★★★★</span>
                        </div>
                        <p>${sp.mota}</p>

                        <div class="product-price2">${sp.gia.toLocaleString()}₫</div>
                        <button class="order-button">Đặt Ngay</button>
                    </div>
                </div>`;
}


export const showTopSanPham = async (): Promise<string> => {
    try {
        let response = await fetch(URL_API + "/sanpham");
        if (!response.ok) {
            throw new Error("Có lỗi khi lấy dữ liệu từ API");
        }

        // Đúng kiểu dữ liệu cho danh sách sản phẩm
        let listSanPham: Tsanpham[] = await response.json();

        // 1. Sắp xếp sản phẩm bán nhiều nhất và lấy 4 sản phẩm
        const top4BanNhieuNhat = listSanPham
            .sort((a, b) => b.soLuongDaBan - a.soLuongDaBan)
            .slice(0, 4);

        // 2. Sắp xếp sản phẩm có điểm đánh giá cao nhất và lấy 4 sản phẩm
        const top4DiemDanhGiaNhieuNhat = listSanPham
            .sort((a, b) => b.diemDanhGia - a.diemDanhGia)
            .slice(0, 4);

        // Tạo chuỗi HTML cho 4 sản phẩm bán nhiều nhất
        const htmlBanNhieuNhat = top4BanNhieuNhat.map(sphot).join("");

        // Tạo chuỗi HTML cho 4 sản phẩm có điểm đánh giá cao nhất
        const htmlDiemDanhGiaNhieuNhat = top4DiemDanhGiaNhieuNhat.map(sphot).join("");

        // Kết hợp và trả về HTML cho cả hai danh sách
        return `<div class="contener">
            <div class=" tieude box">
                <h3>MÓN ĂN HOT THÁNG 9</h3>

            </div>
        </div>
        <section class="contener box">
        ${htmlBanNhieuNhat}
         </section>
        <div class="contener">
            <div class=" tieude box">
                <h3>NHỮNG MÓN KHÔNG THỂ BỎ QUA</h3>

            </div>
        </div>
        <section class="contener box">
        ${htmlDiemDanhGiaNhieuNhat}
         </section>
        `;
    } catch (error) {
        console.error("Lỗi:", error);
        return `<div>Có lỗi xảy ra khi tải danh sách sản phẩm</div>`;
    }
}

// Hàm lấy sản phẩm theo loại từ API
export const showSanPhamTheoLoai = async (loai: string): Promise<void> => {
    try {
        const response = await fetch(URL_API + "/sanpham");
        if (!response.ok) {
            throw new Error("Có lỗi khi lấy dữ liệu từ API");
        }

        // Lấy danh sách sản phẩm từ API
        const listSanPham: Tsanpham[] = await response.json();

        // Lọc sản phẩm theo loại, nếu là "tatca" thì lấy 6 sản phẩm đầu tiên
        let sanPhamTheoLoai = loai === "tatca" 
            ? listSanPham.slice(0, 6)  // Lấy 6 sản phẩm đầu tiên khi loại là "TẤT CẢ"
            : listSanPham.filter(sp => sp.loai === loai);

        // Tạo chuỗi HTML từ danh sách sản phẩm đã lọc
        const htmlSanPham = sanPhamTheoLoai.map(sphot2).join("");

        // Hiển thị sản phẩm vào container
        const sanphamContainer = document.getElementById("sanpham-container");
        if (sanphamContainer) {
            sanphamContainer.innerHTML = htmlSanPham;
        }
    } catch (error) {
        console.error("Lỗi:", error);
        const sanphamContainer = document.getElementById("sanpham-container");
        if (sanphamContainer) {
            sanphamContainer.innerHTML = `<div>Có lỗi xảy ra khi tải sản phẩm</div>`;
        }
    }
};
// Lắng nghe sự kiện click trên các nút điều hướng
document.querySelectorAll<HTMLButtonElement>(".menu-tab").forEach(button => {
    button.addEventListener("click", (event: MouseEvent) => {
        const target = event.currentTarget as HTMLButtonElement;
        const loai = target.getAttribute("data-loai");
        if (loai) {
            showSanPhamTheoLoai(loai);  // Gọi hàm để hiển thị sản phẩm theo loại
        }
    });
});
window.addEventListener("DOMContentLoaded", () => {
    showSanPhamTheoLoai("tatca");  // Hiển thị mặc định 6 sản phẩm thuộc loại "TẤT CẢ"
});