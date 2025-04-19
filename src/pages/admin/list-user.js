import React, { useEffect, useRef } from "react";

const ListUser = () => {

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">

                <div className="card">
                    <h5 className="card-header">Light Table head</h5>
                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light">
                            <tr>
                                <th></th>
                                <th>Users</th>
                                <th>Project</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                            <tr>
                                <td className="align-middle text-center">
                                    <small className="fw-medium">Checkboxes</small>
                                    <div class="form-check mt-4">
                                        <input class="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                        <label class="form-check-label" for="defaultCheck1"> Unchecked </label>
                                    </div>
                                </td>
                                <td>
                                    <ul className="list-unstyled m-0 avatar-group d-flex align-items-center">
                                        <div
                                            data-bs-toggle="tooltip"
                                            data-popup="tooltip-custom"
                                            data-bs-placement="top"
                                            className="avatar avatar-xs pull-up"
                                            title="Lilian Fuller"
                                        >
                                            <img
                                                src="/img-admin/avatars/1.png"
                                                alt="Avatar"
                                                className="rounded-circle"
                                            />
                                        </div>
                                    </ul>
                                </td>
                                <td>
                                    <i className="icon-base bx bxl-angular icon-md text-danger me-4"></i>
                                    <span>Angular Project</span>
                                </td>
                                <td>Albert Cook</td>
                                <td>
                                    <span className="badge bg-label-primary me-1">Active</span>
                                </td>
                                <td>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="icon-base bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="javascript:void(0);">
                                                <i className="icon-base bx bx-edit-alt me-1"></i> Edit
                                            </a>
                                            <a className="dropdown-item" href="javascript:void(0);">
                                                <i className="icon-base bx bx-trash me-1"></i> Delete
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <hr className="my-12"/>

            </div>
            <div className="content-backdrop fade"></div>
        </>
    );
}

export default ListUser;
