const axios = require("axios");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy dữ liệu từ API
    const provinceResponse = await axios.get("https://provinces.open-api.vn/api/");
    const provinces = provinceResponse.data;

    const provinceData = [];
    const districtData = [];
    const wardData = [];

    for (const province of provinces) {
      // Thêm tỉnh vào danh sách
      provinceData.push({
        id: province.code,
        name: province.name,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Lấy danh sách quận/huyện theo tỉnh
      const districtResponse = await axios.get(
        `https://provinces.open-api.vn/api/p/${province.code}?depth=3`
      );
      const districts = districtResponse.data.districts;

      for (const district of districts) {
        // Thêm quận/huyện vào danh sách
        districtData.push({
          id: district.code,
          name: district.name,
          province_id: province.code,
          created_at: new Date(),
          updated_at: new Date(),
        });

        // Thêm phường/xã vào danh sách
        for (const ward of district.wards || []) {
          wardData.push({
            id: ward.code,
            name: ward.name,
            district_id: district.code,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    // Chèn dữ liệu vào database
    await queryInterface.bulkInsert("provinces", provinceData);
    await queryInterface.bulkInsert("districts", districtData);
    await queryInterface.bulkInsert("wards", wardData);
  },

  async down(queryInterface, Sequelize) {
    // Xóa dữ liệu
    await queryInterface.bulkDelete("wards", null, {});
    await queryInterface.bulkDelete("districts", null, {});
    await queryInterface.bulkDelete("provinces", null, {});
  },
};
