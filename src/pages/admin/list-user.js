import React, { useEffect, useRef } from "react";
// import $ from "jquery";
import "datatables.net";
import "datatables.net/js/dataTables";
import "datatables.net-select/js/dataTables.select";
// import "datatables.net-select/js/";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-select";
import "datatables.net-select-dt/css/select.dataTables.css";
const $ = require("jquery");

const ListUser = () => {
    const tableRef = useRef(null);

    useEffect(() => {
        const table = $(tableRef.current).DataTable({
            columnDefs: [
                {
                    render: $.fn.dataTable.render.select(), // Render checkbox ở cột đầu tiên
                    targets: 0,
                },
            ],
            select: {
                style: "multi", // Cho phép chọn nhiều dòng
                selector: "td:first-child", // Checkbox chỉ hoạt động ở cột đầu tiên
            },
            order: [[1, "asc"]], // Sắp xếp theo cột ID
        });

        return () => {
            table.destroy(); // Cleanup khi component bị unmount
        };
    }, []);

    return (
        <>
            <table  ref={tableRef} id="example" className="display"   style={{
                width: "100%",
                // borderCollapse: "collapse",
                // border: "2px solid #007bff",
                // textAlign: "center"
                marginTop: "100px",
            }} >
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Office</th>
                    <th>Age</th>
                    <th>Salary</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td>Tiger Nixon</td>
                    <td>System Architect</td>
                    <td>Edinburgh</td>
                    <td>61</td>
                    <td>$320,800</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Garrett Winters</td>
                    <td>Accountant</td>
                    <td>Tokyo</td>
                    <td>63</td>
                    <td>$170,750</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Ashton Cox</td>
                    <td>Junior Technical Author</td>
                    <td>San Francisco</td>
                    <td>66</td>
                    <td>$86,000</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Cedric Kelly</td>
                    <td>Senior Javascript Developer</td>
                    <td>Edinburgh</td>
                    <td>22</td>
                    <td>$433,060</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Airi Satou</td>
                    <td>Accountant</td>
                    <td>Tokyo</td>
                    <td>33</td>
                    <td>$162,700</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Brielle Williamson</td>
                    <td>Integration Specialist</td>
                    <td>New York</td>
                    <td>61</td>
                    <td>$372,000</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Herrod Chandler</td>
                    <td>Sales Assistant</td>
                    <td>San Francisco</td>
                    <td>59</td>
                    <td>$137,500</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Rhona Davidson</td>
                    <td>Integration Specialist</td>
                    <td>Tokyo</td>
                    <td>55</td>
                    <td>$327,900</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Colleen Hurst</td>
                    <td>Javascript Developer</td>
                    <td>San Francisco</td>
                    <td>39</td>
                    <td>$205,500</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Sonya Frost</td>
                    <td>Software Engineer</td>
                    <td>Edinburgh</td>
                    <td>23</td>
                    <td>$103,600</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Jena Gaines</td>
                    <td>Office Manager</td>
                    <td>London</td>
                    <td>30</td>
                    <td>$90,560</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Quinn Flynn</td>
                    <td>Support Lead</td>
                    <td>Edinburgh</td>
                    <td>22</td>
                    <td>$342,000</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Charde Marshall</td>
                    <td>Regional Director</td>
                    <td>San Francisco</td>
                    <td>36</td>
                    <td>$470,600</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Haley Kennedy</td>
                    <td>Senior Marketing Designer</td>
                    <td>London</td>
                    <td>43</td>
                    <td>$313,500</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Tatyana Fitzpatrick</td>
                    <td>Regional Director</td>
                    <td>London</td>
                    <td>19</td>
                    <td>$385,750</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Michael Silva</td>
                    <td>Marketing Designer</td>
                    <td>London</td>
                    <td>66</td>
                    <td>$198,500</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Paul Byrd</td>
                    <td>Chief Financial Officer (CFO)</td>
                    <td>New York</td>
                    <td>64</td>
                    <td>$725,000</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Gloria Little</td>
                    <td>Systems Administrator</td>
                    <td>New York</td>
                    <td>59</td>
                    <td>$237,500</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Bradley Greer</td>
                    <td>Software Engineer</td>
                    <td>London</td>
                    <td>41</td>
                    <td>$132,000</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Dai Rios</td>
                    <td>Personnel Lead</td>
                    <td>Edinburgh</td>
                    <td>35</td>
                    <td>$217,500</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Jenette Caldwell</td>
                    <td>Development Lead</td>
                    <td>New York</td>
                    <td>30</td>
                    <td>$345,000</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Yuri Berry</td>
                    <td>Chief Marketing Officer (CMO)</td>
                    <td>New York</td>
                    <td>40</td>
                    <td>$675,000</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Caesar Vance</td>
                    <td>Pre-Sales Support</td>
                    <td>New York</td>
                    <td>21</td>
                    <td>$106,450</td>
                </tr>

                </tbody>
                <tfoot>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Office</th>
                    <th>Age</th>
                    <th>Salary</th>
                </tr>
                </tfoot>
            </table>
        </>
    );
}

export default ListUser;
