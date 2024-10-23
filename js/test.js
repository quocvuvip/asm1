const URL_API = 'http://localhost:3000';
const hien1DB = (db) => {
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
};
export const showlistdaubep = async () => {
    try {
        let response = await fetch(URL_API + "/daubep");
        if (!response.ok) {
            throw new Error("Có lỗi khi lấy dữ liệu từ API");
        }
        let listdaubep_arr = await response.json();
        const daubephtlm_arr = listdaubep_arr.map(hien1DB);
        return daubephtlm_arr.join("");
    }
    catch (error) {
        console.error("Lỗi:", error);
        return `<div>Có lỗi xảy ra khi tải danh sách đầu bếp</div>`;
    }
};
const sphot = (sp) => {
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
};
const sphot2 = (sp) => {
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
};
export const showTopSanPham = async () => {
    try {
        let response = await fetch(URL_API + "/sanpham");
        if (!response.ok) {
            throw new Error("Có lỗi khi lấy dữ liệu từ API");
        }
        let listSanPham = await response.json();
        const top4BanNhieuNhat = listSanPham
            .sort((a, b) => b.soLuongDaBan - a.soLuongDaBan)
            .slice(0, 4);
        const top4DiemDanhGiaNhieuNhat = listSanPham
            .sort((a, b) => b.diemDanhGia - a.diemDanhGia)
            .slice(0, 4);
        const htmlBanNhieuNhat = top4BanNhieuNhat.map(sphot).join("");
        const htmlDiemDanhGiaNhieuNhat = top4DiemDanhGiaNhieuNhat.map(sphot).join("");
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
    }
    catch (error) {
        console.error("Lỗi:", error);
        return `<div>Có lỗi xảy ra khi tải danh sách sản phẩm</div>`;
    }
};
export const showSanPhamTheoLoai = async (loai) => {
    try {
        const response = await fetch(URL_API + "/sanpham");
        if (!response.ok) {
            throw new Error("Có lỗi khi lấy dữ liệu từ API");
        }
        const listSanPham = await response.json();
        let sanPhamTheoLoai = loai === "tatca"
            ? listSanPham.slice(0, 6)
            : listSanPham.filter(sp => sp.loai === loai);
        const htmlSanPham = sanPhamTheoLoai.map(sphot2).join("");
        const sanphamContainer = document.getElementById("sanpham-container");
        if (sanphamContainer) {
            sanphamContainer.innerHTML = htmlSanPham;
        }
    }
    catch (error) {
        console.error("Lỗi:", error);
        const sanphamContainer = document.getElementById("sanpham-container");
        if (sanphamContainer) {
            sanphamContainer.innerHTML = `<div>Có lỗi xảy ra khi tải sản phẩm</div>`;
        }
    }
};
document.querySelectorAll(".menu-tab").forEach(button => {
    button.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const loai = target.getAttribute("data-loai");
        if (loai) {
            showSanPhamTheoLoai(loai);
        }
    });
});
window.addEventListener("DOMContentLoaded", () => {
    showSanPhamTheoLoai("tatca");
});
