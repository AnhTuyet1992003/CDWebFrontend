import React, { useEffect, useRef } from "react";

import '../../assets/admin/vendor/css/core.css'

const AddProduct = () => {
    useEffect(() => {
        const checkbox = document.getElementById('defaultCheck2');
        if (checkbox) {
            checkbox.indeterminate = true;
        }
    }, []);
    return (
        // <>
        //     <div className="container-xxl flex-grow-1 container-p-y">
        //         <div className="row g-6">
        //             <div className="col-md-6">
        //                 <div className="card">
        //                     <h5 className="card-header">Default</h5>
        //                     <div className="card-body">
        //                         <div>
        //                             <label htmlFor="defaultFormControlInput" className="form-label">Name</label>
        //                             <input
        //                                 type="text"
        //                                 className="form-control"
        //                                 id="defaultFormControlInput"
        //                                 placeholder="John Doe"
        //                                 aria-describedby="defaultFormControlHelp"/>
        //                             <div id="defaultFormControlHelp" className="form-text">
        //                                 We'll never share your details with anyone else.
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="col-md-6">
        //                 <div className="card">
        //                     <h5 className="card-header">Float label</h5>
        //                     <div className="card-body">
        //                         <div className="form-floating">
        //                             <input
        //                                 type="text"
        //                                 className="form-control"
        //                                 id="floatingInput"
        //                                 placeholder="John Doe"
        //                                 aria-describedby="floatingInputHelp"/>
        //                             <label htmlFor="floatingInput">Name</label>
        //                             <div id="floatingInputHelp" className="form-text">
        //                                 We'll never share your details with anyone else.
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //
        //             <div className="col-md-6">
        //                 <div className="card">
        //                     <h5 className="card-header">Form Controls</h5>
        //                     <div className="card-body">
        //                         <div className="mb-4">
        //                             <label htmlFor="exampleFormControlInput1" className="form-label">Email
        //                                 address</label>
        //                             <input
        //                                 type="email"
        //                                 className="form-control"
        //                                 id="exampleFormControlInput1"
        //                                 placeholder="name@example.com"/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="exampleFormControlReadOnlyInput1" className="form-label">Read
        //                                 only</label>
        //                             <input
        //                                 className="form-control"
        //                                 type="text"
        //                                 id="exampleFormControlReadOnlyInput1"
        //                                 value="Readonly input here..."
        //                                 aria-label="readonly input example"
        //                                 readOnly/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="exampleFormControlReadOnlyInputPlain1" className="form-label">Read
        //                                 plain</label>
        //                             <input
        //                                 type="text"
        //                                 readOnly
        //                                 className="form-control-plaintext"
        //                                 id="exampleFormControlReadOnlyInputPlain1"
        //                                 value="email@example.com"/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="exampleFormControlSelect1" className="form-label">Example
        //                                 select</label>
        //                             <select className="form-select" id="exampleFormControlSelect1"
        //                                     aria-label="Default select example">
        //                                 <option selected>Open this select menu</option>
        //                                 <option value="1">One</option>
        //                                 <option value="2">Two</option>
        //                                 <option value="3">Three</option>
        //                             </select>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="exampleDataList" className="form-label">Datalist example</label>
        //                             <input
        //                                 className="form-control"
        //                                 list="datalistOptions"
        //                                 id="exampleDataList"
        //                                 placeholder="Type to search..."/>
        //                             <datalist id="datalistOptions">
        //                                 <option value="San Francisco"></option>
        //                                 <option value="New York"></option>
        //                                 <option value="Seattle"></option>
        //                                 <option value="Los Angeles"></option>
        //                                 <option value="Chicago"></option>
        //                             </datalist>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="exampleFormControlSelect2" className="form-label">Example multiple
        //                                 select</label>
        //                             <select
        //                                 multiple
        //                                 className="form-select"
        //                                 id="exampleFormControlSelect2"
        //                                 aria-label="Multiple select example">
        //                                 <option selected>Open this select menu</option>
        //                                 <option value="1">One</option>
        //                                 <option value="2">Two</option>
        //                                 <option value="3">Three</option>
        //                             </select>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="exampleFormControlSelect3" className="form-label"
        //                             >An example of a multi-select option is the 'size' attribute</label
        //                             >
        //                             <select
        //                                 className="form-select"
        //                                 id="exampleFormControlSelect3"
        //                                 size="2"
        //                                 aria-label="Size 2 select example">
        //                                 <option selected>Open this select menu</option>
        //                                 <option value="1">One</option>
        //                                 <option value="2">Two</option>
        //                                 <option value="3">Three</option>
        //                             </select>
        //                         </div>
        //                         <div>
        //                             <label htmlFor="exampleFormControlTextarea1" className="form-label">Example
        //                                 textarea</label>
        //                             <textarea className="form-control" id="exampleFormControlTextarea1"
        //                                       rows="3"></textarea>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //
        //             <div className="col-md-6">
        //                 <div className="card">
        //                     <h5 className="card-header">Input Sizing & Shape</h5>
        //                     <div className="card-body">
        //                         <small className="fw-medium">Input text</small>
        //
        //                         <div className="mt-2 mb-4">
        //                             <label htmlFor="largeInput" className="form-label">Large input</label>
        //                             <input
        //                                 id="largeInput"
        //                                 className="form-control form-control-lg"
        //                                 type="text"
        //                                 placeholder=".form-control-lg"/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="defaultInput" className="form-label">Default input</label>
        //                             <input id="defaultInput" className="form-control" type="text"
        //                                    placeholder="Default input"/>
        //                         </div>
        //                         <div>
        //                             <label htmlFor="smallInput" className="form-label">Small input</label>
        //                             <input
        //                                 id="smallInput"
        //                                 className="form-control form-control-sm"
        //                                 type="text"
        //                                 placeholder=".form-control-sm"/>
        //                         </div>
        //                     </div>
        //                     <hr className="m-0"/>
        //                     <div className="card-body">
        //                         <small className="fw-medium">Input select</small>
        //                         <div className="mt-2 mb-4">
        //                             <label htmlFor="largeSelect" className="form-label">Large select</label>
        //                             <select id="largeSelect" className="form-select form-select-lg">
        //                                 <option>Large select</option>
        //                                 <option value="1">One</option>
        //                                 <option value="2">Two</option>
        //                                 <option value="3">Three</option>
        //                             </select>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="defaultSelect" className="form-label">Default select</label>
        //                             <select id="defaultSelect" className="form-select">
        //                                 <option>Default select</option>
        //                                 <option value="1">One</option>
        //                                 <option value="2">Two</option>
        //                                 <option value="3">Three</option>
        //                             </select>
        //                         </div>
        //                         <div>
        //                             <label htmlFor="smallSelect" className="form-label">Small select</label>
        //                             <select id="smallSelect" className="form-select form-select-sm">
        //                                 <option>Small select</option>
        //                                 <option value="1">One</option>
        //                                 <option value="2">Two</option>
        //                                 <option value="3">Three</option>
        //                             </select>
        //                         </div>
        //                     </div>
        //                     <hr className="m-0"/>
        //                     <div className="card-body">
        //                         <small className="fw-medium">Input Shape</small>
        //                         <div className="mt-2">
        //                             <label htmlFor="roundedInput" className="form-label">Rounded input</label>
        //                             <input
        //                                 id="roundedInput"
        //                                 className="form-control rounded-pill"
        //                                 type="text"
        //                                 placeholder="Default input"/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //
        //             <div className="col-xl-6">
        //                 <div className="card mb-6">
        //                     <h5 className="card-header">Checkboxes and Radios</h5>
        //                     <div className="row g-0">
        //                         <div className="col-md p-6">
        //                             <small className="fw-medium">Checkboxes</small>
        //                             <div className="form-check mt-4">
        //                                 <input className="form-check-input" type="checkbox" value=""
        //                                        id="defaultCheck1"/>
        //                                 <label className="form-check-label" htmlFor="defaultCheck1"> Unchecked </label>
        //                             </div>
        //
        //                             <div className="form-check">
        //                                 <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"
        //                                        checked/>
        //                                 <label className="form-check-label"
        //                                        htmlFor="defaultCheck2"> Indeterminate </label>
        //                             </div>
        //                             <div className="form-check">
        //                                 <input className="form-check-input" type="checkbox" value="" id="defaultCheck3"
        //                                        checked/>
        //                                 <label className="form-check-label" htmlFor="defaultCheck3"> Checked </label>
        //                             </div>
        //                             <div className="form-check">
        //                                 <input className="form-check-input" type="checkbox" value="" id="disabledCheck1"
        //                                        disabled/>
        //                                 <label className="form-check-label" htmlFor="disabledCheck1"> Disabled
        //                                     Unchecked </label>
        //                             </div>
        //                             <div className="form-check">
        //                                 <input
        //                                     className="form-check-input"
        //                                     type="checkbox"
        //                                     value=""
        //                                     id="disabledCheck2"
        //                                     disabled
        //                                     checked/>
        //                                 <label className="form-check-label" htmlFor="disabledCheck2"> Disabled
        //                                     Checked </label>
        //                             </div>
        //                         </div>
        //                         <div className="col-md p-6">
        //                             <small className="fw-medium">Radio</small>
        //                             <div className="form-check mt-4">
        //                                 <input
        //                                     name="default-radio-1"
        //                                     className="form-check-input"
        //                                     type="radio"
        //                                     value=""
        //                                     id="defaultRadio1"/>
        //                                 <label className="form-check-label" htmlFor="defaultRadio1"> Unchecked </label>
        //                             </div>
        //                             <div className="form-check">
        //                                 <input
        //                                     name="default-radio-1"
        //                                     className="form-check-input"
        //                                     type="radio"
        //                                     value=""
        //                                     id="defaultRadio2"
        //                                     checked/>
        //                                 <label className="form-check-label" htmlFor="defaultRadio2"> Checked </label>
        //                             </div>
        //                             <div className="form-check">
        //                                 <input className="form-check-input" type="radio" value="" id="disabledRadio1"
        //                                        disabled/>
        //                                 <label className="form-check-label" htmlFor="disabledRadio1"> Disabled
        //                                     unchecked </label>
        //                             </div>
        //                             <div className="form-check">
        //                                 <input className="form-check-input" type="radio" value="" id="disabledRadio2"
        //                                        disabled checked/>
        //                                 <label className="form-check-label" htmlFor="disabledRadio2"> Disabled
        //                                     checkbox </label>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <hr className="m-0"/>
        //                     <div className="row g-0">
        //                         <div className="col-md p-6">
        //                             <small className="fw-medium d-block">Inline Checkboxes</small>
        //                             <div className="form-check form-check-inline mt-4">
        //                                 <input className="form-check-input" type="checkbox" id="inlineCheckbox1"
        //                                        value="option1"/>
        //                                 <label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
        //                             </div>
        //                             <div className="form-check form-check-inline">
        //                                 <input className="form-check-input" type="checkbox" id="inlineCheckbox2"
        //                                        value="option2"/>
        //                                 <label className="form-check-label" htmlFor="inlineCheckbox2">2</label>
        //                             </div>
        //                             <div className="form-check form-check-inline">
        //                                 <input
        //                                     className="form-check-input"
        //                                     type="checkbox"
        //                                     id="inlineCheckbox3"
        //                                     value="option3"
        //                                     disabled/>
        //                                 <label className="form-check-label" htmlFor="inlineCheckbox3">3
        //                                     (disabled)</label>
        //                             </div>
        //                         </div>
        //                         <div className="col-md p-6">
        //                             <small className="fw-medium d-block">Inline Radio</small>
        //                             <div className="form-check form-check-inline mt-4">
        //                                 <input
        //                                     className="form-check-input"
        //                                     type="radio"
        //                                     name="inlineRadioOptions"
        //                                     id="inlineRadio1"
        //                                     value="option1"/>
        //                                 <label className="form-check-label" htmlFor="inlineRadio1">1</label>
        //                             </div>
        //                             <div className="form-check form-check-inline">
        //                                 <input
        //                                     className="form-check-input"
        //                                     type="radio"
        //                                     name="inlineRadioOptions"
        //                                     id="inlineRadio2"
        //                                     value="option2"/>
        //                                 <label className="form-check-label" htmlFor="inlineRadio2">2</label>
        //                             </div>
        //                             <div className="form-check form-check-inline">
        //                                 <input
        //                                     className="form-check-input"
        //                                     type="radio"
        //                                     name="inlineRadioOptions"
        //                                     id="inlineRadio3"
        //                                     value="option3"
        //                                     disabled/>
        //                                 <label className="form-check-label" htmlFor="inlineRadio3">3 (disabled)</label>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //
        //                 <div className="card mb-6">
        //                     <div className="row row-bordered g-0">
        //                         <div className="col-xxl-6 col-xl-12 col-md-6">
        //                             <h5 className="card-header">Switches</h5>
        //                             <div className="card-body">
        //                                 <div className="form-check form-switch mb-2">
        //                                     <input className="form-check-input" type="checkbox"
        //                                            id="flexSwitchCheckDefault"/>
        //                                     <label className="form-check-label" htmlFor="flexSwitchCheckDefault"
        //                                     >Default switch checkbox input</label
        //                                     >
        //                                 </div>
        //                                 <div className="form-check form-switch mb-2">
        //                                     <input className="form-check-input" type="checkbox"
        //                                            id="flexSwitchCheckChecked" checked/>
        //                                     <label className="form-check-label" htmlFor="flexSwitchCheckChecked"
        //                                     >Checked switch checkbox input</label
        //                                     >
        //                                 </div>
        //                                 <div className="form-check form-switch mb-2">
        //                                     <input className="form-check-input" type="checkbox"
        //                                            id="flexSwitchCheckDisabled" disabled/>
        //                                     <label className="form-check-label" htmlFor="flexSwitchCheckDisabled"
        //                                     >Disabled switch checkbox input</label
        //                                     >
        //                                 </div>
        //                                 <div className="form-check form-switch">
        //                                     <input
        //                                         className="form-check-input"
        //                                         type="checkbox"
        //                                         id="flexSwitchCheckCheckedDisabled"
        //                                         checked
        //                                         disabled/>
        //                                     <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled"
        //                                     >Disabled checked switch checkbox input</label
        //                                     >
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="col-xxl-6 col-xl-12 col-md-6">
        //                             <h5 className="card-header text-end">Reverse</h5>
        //                             <div className="card-body">
        //                                 <div className="form-check form-check-reverse">
        //                                     <input className="form-check-input" type="checkbox" value=""
        //                                            id="reverseCheck1"/>
        //                                     <label className="form-check-label" htmlFor="reverseCheck1"> Reverse
        //                                         checkbox </label>
        //                                 </div>
        //                                 <div className="form-check form-check-reverse">
        //                                     <input className="form-check-input" type="checkbox" value=""
        //                                            id="reverseCheck2" disabled/>
        //                                     <label className="form-check-label" htmlFor="reverseCheck2"> Disabled
        //                                         reverse checkbox </label>
        //                                 </div>
        //                                 <div className="form-check form-check-reverse">
        //                                     <input
        //                                         name="reverse-radio-1"
        //                                         className="form-check-input"
        //                                         type="radio"
        //                                         value=""
        //                                         id="reverseRadio1"/>
        //                                     <label className="form-check-label"
        //                                            htmlFor="reverseRadio1"> Unchecked </label>
        //                                 </div>
        //                                 <div className="form-check form-check-reverse">
        //                                     <input
        //                                         name="reverse-radio-1"
        //                                         className="form-check-input"
        //                                         type="radio"
        //                                         value=""
        //                                         id="reverseRadio2"
        //                                         checked/>
        //                                     <label className="form-check-label"
        //                                            htmlFor="reverseRadio2"> Checked </label>
        //                                 </div>
        //                                 <div className="form-check form-switch form-check-reverse mb-0">
        //                                     <input className="form-check-input" type="checkbox"
        //                                            id="flexSwitchCheckReverse"/>
        //                                     <label className="form-check-label" htmlFor="flexSwitchCheckReverse"
        //                                     >Reverse switch checkbox input</label
        //                                     >
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //
        //                 <div className="card">
        //                     <h5 className="card-header">Range</h5>
        //                     <div className="card-body">
        //                         <div className="mb-4">
        //                             <label htmlFor="formRange1" className="form-label">Example range</label>
        //                             <input type="range" className="form-range" id="formRange1"/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="disabledRange" className="form-label">Disabled range</label>
        //                             <input type="range" className="form-range" id="disabledRange" disabled/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="formRange2" className="form-label">Min and max</label>
        //                             <input type="range" className="form-range" min="0" max="5" id="formRange2"/>
        //                         </div>
        //                         <div>
        //                             <label htmlFor="formRange3" className="form-label">Steps</label>
        //                             <input type="range" className="form-range" min="0" max="5" step="0.5"
        //                                    id="formRange3"/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //
        //             <div className="col-xl-6">
        //                 <div className="card mb-6">
        //                     <h5 className="card-header">HTML5 Inputs</h5>
        //                     <div className="card-body">
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-text-input" className="col-md-2 col-form-label">Text</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="text" value="Sneat"
        //                                        id="html5-text-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-search-input"
        //                                    className="col-md-2 col-form-label">Search</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="search" value="Search ..."
        //                                        id="html5-search-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-email-input" className="col-md-2 col-form-label">Email</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="email" value="john@example.com"
        //                                        id="html5-email-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-url-input" className="col-md-2 col-form-label">URL</label>
        //                             <div className="col-md-10">
        //                                 <input
        //                                     className="form-control"
        //                                     type="url"
        //                                     value="https://themeselection.com"
        //                                     id="html5-url-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-tel-input" className="col-md-2 col-form-label">Phone</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="tel" value="90-(164)-188-556"
        //                                        id="html5-tel-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-password-input"
        //                                    className="col-md-2 col-form-label">Password</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="password" value="password"
        //                                        id="html5-password-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-number-input"
        //                                    className="col-md-2 col-form-label">Number</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="number" value="18"
        //                                        id="html5-number-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-datetime-local-input"
        //                                    className="col-md-2 col-form-label">Datetime</label>
        //                             <div className="col-md-10">
        //                                 <input
        //                                     className="form-control"
        //                                     type="datetime-local"
        //                                     value="2021-06-18T12:30:00"
        //                                     id="html5-datetime-local-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-date-input" className="col-md-2 col-form-label">Date</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="date" value="2021-06-18"
        //                                        id="html5-date-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-month-input" className="col-md-2 col-form-label">Month</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="month" value="2021-06"
        //                                        id="html5-month-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-week-input" className="col-md-2 col-form-label">Week</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="week" value="2021-W25"
        //                                        id="html5-week-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-time-input" className="col-md-2 col-form-label">Time</label>
        //                             <div className="col-md-10">
        //                                 <input className="form-control" type="time" value="12:30:00"
        //                                        id="html5-time-input"/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-4 row">
        //                             <label htmlFor="html5-color-input" className="col-md-2 col-form-label">Color</label>
        //                             <div className="col-md-10">
        //                                 <input
        //                                     type="color"
        //                                     className="form-control"
        //                                     id="html5-color-input"
        //                                     value="#666EE8"
        //                                     title="Choose your color"/>
        //                             </div>
        //                         </div>
        //                         <div className="row">
        //                             <label htmlFor="html5-range" className="col-md-2 col-form-label">Range</label>
        //                             <div className="col-md-10">
        //                                 <input type="range" className="form-range mt-4" id="html5-range"/>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //
        //                 <div className="card">
        //                     <h5 className="card-header">File input</h5>
        //                     <div className="card-body">
        //                         <div className="mb-4">
        //                             <label htmlFor="formFile" className="form-label">Default file input example</label>
        //                             <input className="form-control" type="file" id="formFile"/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="formFileMultiple" className="form-label">Multiple files input
        //                                 example</label>
        //                             <input className="form-control" type="file" id="formFileMultiple" multiple/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="formFileDisabled" className="form-label">Disabled file input
        //                                 example</label>
        //                             <input className="form-control" type="file" id="formFileDisabled" disabled/>
        //                         </div>
        //                         <div className="mb-4">
        //                             <label htmlFor="formFileSm" className="form-label">Small file input example</label>
        //                             <input className="form-control form-control-sm" id="formFileSm" type="file"/>
        //                         </div>
        //                         <div>
        //                             <label htmlFor="formFileLg" className="form-label">Large file input example</label>
        //                             <input className="form-control form-control-lg" id="formFileLg" type="file"/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="content-backdrop fade"></div>
        // </>
        <body>
            {/* Layout wrapper */}
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    {/* Menu */}
                    <aside
                        id="layout-menu"
                        className="layout-menu menu-vertical menu bg-menu-theme"
                    >
                        <div className="app-brand demo">
                            <a href="index.html" className="app-brand-link">
            <span className="app-brand-logo demo">
              <span className="text-primary">
                <svg
                    width={25}
                    viewBox="0 0 25 42"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <path
                        d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                        id="path-1"
                    />
                    <path
                        d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                        id="path-3"
                    />
                    <path
                        d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                        id="path-4"
                    />
                    <path
                        d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                        id="path-5"
                    />
                  </defs>
                  <g
                      id="g-app-brand"
                      stroke="none"
                      strokeWidth={1}
                      fill="none"
                      fillRule="evenodd"
                  >
                    <g
                        id="Brand-Logo"
                        transform="translate(-27.000000, -15.000000)"
                    >
                      <g id="Icon" transform="translate(27.000000, 15.000000)">
                        <g id="Mask" transform="translate(0.000000, 8.000000)">
                          <mask id="mask-2" fill="white">
                            <use xlinkHref="#path-1" />
                          </mask>
                          <use fill="currentColor" xlinkHref="#path-1" />
                          <g id="Path-3" mask="url(#mask-2)">
                            <use fill="currentColor" xlinkHref="#path-3" />
                            <use
                                fillOpacity="0.2"
                                fill="#FFFFFF"
                                xlinkHref="#path-3"
                            />
                          </g>
                          <g id="Path-4" mask="url(#mask-2)">
                            <use fill="currentColor" xlinkHref="#path-4" />
                            <use
                                fillOpacity="0.2"
                                fill="#FFFFFF"
                                xlinkHref="#path-4"
                            />
                          </g>
                        </g>
                        <g
                            id="Triangle"
                            transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) "
                        >
                          <use fill="currentColor" xlinkHref="#path-5" />
                          <use
                              fillOpacity="0.2"
                              fill="#FFFFFF"
                              xlinkHref="#path-5"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </span>
                                <span className="app-brand-text demo menu-text fw-bold ms-2">
              Sneat
            </span>
                            </a>
                            <a
                                href="javascript:void(0);"
                                className="layout-menu-toggle menu-link text-large ms-auto"
                            >
                                <i className="bx bx-chevron-left d-block d-xl-none align-middle" />
                            </a>
                        </div>
                        <div className="menu-divider mt-0" />
                        <div className="menu-inner-shadow" />
                        <ul className="menu-inner py-1">
                            {/* Dashboards */}
                            <li className="menu-item">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-home-smile" />
                                    <div className="text-truncate" data-i18n="Dashboards">
                                        Dashboards
                                    </div>
                                    <span className="badge rounded-pill bg-danger ms-auto">5</span>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a href="index.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Analytics">
                                                Analytics
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/dashboards-crm.html"
                                            target="_blank"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="CRM">
                                                CRM
                                            </div>
                                            <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                                Pro
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-ecommerce-dashboard.html"
                                            target="_blank"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="eCommerce">
                                                eCommerce
                                            </div>
                                            <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                                Pro
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-logistics-dashboard.html"
                                            target="_blank"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="Logistics">
                                                Logistics
                                            </div>
                                            <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                                Pro
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-academy-dashboard.html"
                                            target="_blank"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="Academy">
                                                Academy
                                            </div>
                                            <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                                Pro
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Layouts */}
                            <li className="menu-item">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-layout" />
                                    <div className="text-truncate" data-i18n="Layouts">
                                        Layouts
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a href="layouts-without-menu.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Without menu">
                                                Without menu
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="layouts-without-navbar.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Without navbar">
                                                Without navbar
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="layouts-fluid.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Fluid">
                                                Fluid
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="layouts-container.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Container">
                                                Container
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="layouts-blank.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Blank">
                                                Blank
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Front Pages */}
                            <li className="menu-item">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-store" />
                                    <div className="text-truncate" data-i18n="Front Pages">
                                        Front Pages
                                    </div>
                                    <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                        Pro
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/landing-page.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Landing">
                                                Landing
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/pricing-page.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Pricing">
                                                Pricing
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/payment-page.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Payment">
                                                Payment
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/checkout-page.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Checkout">
                                                Checkout
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/help-center-landing.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Help Center">
                                                Help Center
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Apps & Pages */}
                            <li className="menu-header small text-uppercase">
                                <span className="menu-header-text">Apps &amp; Pages</span>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-email.html"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-envelope" />
                                    <div className="text-truncate" data-i18n="Email">
                                        Email
                                    </div>
                                    <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                        Pro
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-chat.html"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-chat" />
                                    <div className="text-truncate" data-i18n="Chat">
                                        Chat
                                    </div>
                                    <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                        Pro
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-calendar.html"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-calendar" />
                                    <div className="text-truncate" data-i18n="Calendar">
                                        Calendar
                                    </div>
                                    <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                        Pro
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-kanban.html"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-grid" />
                                    <div className="text-truncate" data-i18n="Kanban">
                                        Kanban
                                    </div>
                                    <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                        Pro
                                    </div>
                                </a>
                            </li>
                            {/* Pages */}
                            <li className="menu-item">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-dock-top" />
                                    <div className="text-truncate" data-i18n="Account Settings">
                                        Account Settings
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a
                                            href="pages-account-settings-account.html"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="Account">
                                                Account
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="pages-account-settings-notifications.html"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="Notifications">
                                                Notifications
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="pages-account-settings-connections.html"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="Connections">
                                                Connections
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="menu-item">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-lock-open-alt" />
                                    <div className="text-truncate" data-i18n="Authentications">
                                        Authentications
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a
                                            href="auth-login-basic.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Basic">
                                                Login
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="auth-register-basic.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Basic">
                                                Register
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="auth-forgot-password-basic.html"
                                            className="menu-link"
                                            target="_blank"
                                        >
                                            <div className="text-truncate" data-i18n="Basic">
                                                Forgot Password
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="menu-item">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-cube-alt" />
                                    <div className="text-truncate" data-i18n="Misc">
                                        Misc
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a href="pages-misc-error.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Error">
                                                Error
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="pages-misc-under-maintenance.html"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="Under Maintenance">
                                                Under Maintenance
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Components */}
                            <li className="menu-header small text-uppercase">
                                <span className="menu-header-text">Components</span>
                            </li>
                            {/* Cards */}
                            <li className="menu-item">
                                <a href="cards-basic.html" className="menu-link">
                                    <i className="menu-icon tf-icons bx bx-collection" />
                                    <div className="text-truncate" data-i18n="Basic">
                                        Cards
                                    </div>
                                </a>
                            </li>
                            {/* User interface */}
                            <li className="menu-item">
                                <a href="javascript:void(0)" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-box" />
                                    <div className="text-truncate" data-i18n="User interface">
                                        User interface
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a href="ui-accordion.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Accordion">
                                                Accordion
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-alerts.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Alerts">
                                                Alerts
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-badges.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Badges">
                                                Badges
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-buttons.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Buttons">
                                                Buttons
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-carousel.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Carousel">
                                                Carousel
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-collapse.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Collapse">
                                                Collapse
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-dropdowns.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Dropdowns">
                                                Dropdowns
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-footer.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Footer">
                                                Footer
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-list-groups.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="List Groups">
                                                List groups
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-modals.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Modals">
                                                Modals
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-navbar.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Navbar">
                                                Navbar
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-offcanvas.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Offcanvas">
                                                Offcanvas
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-pagination-breadcrumbs.html" className="menu-link">
                                            <div
                                                className="text-truncate"
                                                data-i18n="Pagination & Breadcrumbs"
                                            >
                                                Pagination &amp; Breadcrumbs
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-progress.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Progress">
                                                Progress
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-spinners.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Spinners">
                                                Spinners
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-tabs-pills.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Tabs & Pills">
                                                Tabs &amp; Pills
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-toasts.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Toasts">
                                                Toasts
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-tooltips-popovers.html" className="menu-link">
                                            <div
                                                className="text-truncate"
                                                data-i18n="Tooltips & Popovers"
                                            >
                                                Tooltips &amp; Popovers
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="ui-typography.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Typography">
                                                Typography
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Extended components */}
                            <li className="menu-item">
                                <a href="javascript:void(0)" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-copy" />
                                    <div className="text-truncate" data-i18n="Extended UI">
                                        Extended UI
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a
                                            href="extended-ui-perfect-scrollbar.html"
                                            className="menu-link"
                                        >
                                            <div className="text-truncate" data-i18n="Perfect Scrollbar">
                                                Perfect Scrollbar
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="extended-ui-text-divider.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Text Divider">
                                                Text Divider
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="menu-item">
                                <a href="icons-boxicons.html" className="menu-link">
                                    <i className="menu-icon tf-icons bx bx-crown" />
                                    <div className="text-truncate" data-i18n="Boxicons">
                                        Boxicons
                                    </div>
                                </a>
                            </li>
                            {/* Forms & Tables */}
                            <li className="menu-header small text-uppercase">
                                <span className="menu-header-text">Forms &amp; Tables</span>
                            </li>
                            {/* Forms */}
                            <li className="menu-item active open">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-detail" />
                                    <div className="text-truncate" data-i18n="Form Elements">
                                        Form Elements
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item active">
                                        <a href="forms-basic-inputs.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Basic Inputs">
                                                Basic Inputs
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="forms-input-groups.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Input groups">
                                                Input groups
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="menu-item">
                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                    <i className="menu-icon tf-icons bx bx-detail" />
                                    <div className="text-truncate" data-i18n="Form Layouts">
                                        Form Layouts
                                    </div>
                                </a>
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <a href="form-layouts-vertical.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Vertical Form">
                                                Vertical Form
                                            </div>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="form-layouts-horizontal.html" className="menu-link">
                                            <div className="text-truncate" data-i18n="Horizontal Form">
                                                Horizontal Form
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Form Validation */}
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/form-validation.html"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-list-check" />
                                    <div className="text-truncate" data-i18n="Form Validation">
                                        Form Validation
                                    </div>
                                    <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                        Pro
                                    </div>
                                </a>
                            </li>
                            {/* Tables */}
                            <li className="menu-item">
                                <a href="tables-basic.html" className="menu-link">
                                    <i className="menu-icon tf-icons bx bx-table" />
                                    <div className="text-truncate" data-i18n="Tables">
                                        Tables
                                    </div>
                                </a>
                            </li>
                            {/* Data Tables */}
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/tables-datatables-basic.html"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-grid" />
                                    <div className="text-truncate" data-i18n="Datatables">
                                        Datatables
                                    </div>
                                    <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                                        Pro
                                    </div>
                                </a>
                            </li>
                            {/* Misc */}
                            <li className="menu-header small text-uppercase">
                                <span className="menu-header-text">Misc</span>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://github.com/themeselection/sneat-bootstrap-html-admin-template-free/issues"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-support" />
                                    <div className="text-truncate" data-i18n="Support">
                                        Support
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                                    target="_blank"
                                    className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-file" />
                                    <div className="text-truncate" data-i18n="Documentation">
                                        Documentation
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </aside>
                    {/* / Menu */}
                    {/* Layout container */}
                    <div className="layout-page">
                        {/* Navbar */}
                        <nav
                            className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
                            id="layout-navbar"
                        >
                            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                                <a
                                    className="nav-item nav-link px-0 me-xl-6"
                                    href="javascript:void(0)"
                                >
                                    <i className="icon-base bx bx-menu icon-md" />
                                </a>
                            </div>
                            <div
                                className="navbar-nav-right d-flex align-items-center justify-content-end"
                                id="navbar-collapse"
                            >
                                {/* Search */}
                                <div className="navbar-nav align-items-center me-auto">
                                    <div className="nav-item d-flex align-items-center">
                <span className="w-px-22 h-px-22">
                  <i className="icon-base bx bx-search icon-md" />
                </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 shadow-none ps-1 ps-sm-2 d-md-block d-none"
                                            placeholder="Search..."
                                            aria-label="Search..."
                                        />
                                    </div>
                                </div>
                                {/* /Search */}
                                <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                                    {/* Place this tag where you want the button to render. */}
                                    <li className="nav-item lh-1 me-4">
                                        <a
                                            className="github-button"
                                            href="https://github.com/themeselection/sneat-bootstrap-html-admin-template-free"
                                            data-icon="octicon-star"
                                            data-size="large"
                                            data-show-count="true"
                                            aria-label="Star themeselection/sneat-html-admin-template-free on GitHub"
                                        >
                                            Star
                                        </a>
                                    </li>
                                    {/* User */}
                                    <li className="nav-item navbar-dropdown dropdown-user dropdown">
                                        <a
                                            className="nav-link dropdown-toggle hide-arrow p-0"
                                            href="javascript:void(0);"
                                            data-bs-toggle="dropdown"
                                        >
                                            <div className="avatar avatar-online">
                                                <img
                                                    src="../assets/img/avatars/1.png"
                                                    alt=""
                                                    className="w-px-40 h-auto rounded-circle"
                                                />
                                            </div>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <div className="d-flex">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar avatar-online">
                                                                <img
                                                                    src="../assets/img/avatars/1.png"
                                                                    alt=""
                                                                    className="w-px-40 h-auto rounded-circle"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-0">John Doe</h6>
                                                            <small className="text-body-secondary">Admin</small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <div className="dropdown-divider my-1" />
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <i className="icon-base bx bx-user icon-md me-3" />
                                                    <span>My Profile</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <i className="icon-base bx bx-cog icon-md me-3" />
                                                    <span>Settings</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                      <span className="d-flex align-items-center align-middle">
                        <i className="flex-shrink-0 icon-base bx bx-credit-card icon-md me-3" />
                        <span className="flex-grow-1 align-middle">
                          Billing Plan
                        </span>
                        <span className="flex-shrink-0 badge rounded-pill bg-danger">
                          4
                        </span>
                      </span>
                                                </a>
                                            </li>
                                            <li>
                                                <div className="dropdown-divider my-1" />
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="javascript:void(0);">
                                                    <i className="icon-base bx bx-power-off icon-md me-3" />
                                                    <span>Log Out</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    {/*/ User */}
                                </ul>
                            </div>
                        </nav>
                        {/* / Navbar */}
                        {/* Content wrapper */}
                        <div className="content-wrapper">
                            {/* Content */}
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <div className="row g-6">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <h5 className="card-header">Default</h5>
                                            <div className="card-body">
                                                <div>
                                                    <label
                                                        htmlFor="defaultFormControlInput"
                                                        className="form-label"
                                                    >
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="defaultFormControlInput"
                                                        placeholder="John Doe"
                                                        aria-describedby="defaultFormControlHelp"
                                                    />
                                                    <div id="defaultFormControlHelp" className="form-text">
                                                        We'll never share your details with anyone else.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card">
                                            <h5 className="card-header">Float label</h5>
                                            <div className="card-body">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="floatingInput"
                                                        placeholder="John Doe"
                                                        aria-describedby="floatingInputHelp"
                                                    />
                                                    <label htmlFor="floatingInput">Name</label>
                                                    <div id="floatingInputHelp" className="form-text">
                                                        We'll never share your details with anyone else.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Form controls */}
                                    <div className="col-md-6">
                                        <div className="card">
                                            <h5 className="card-header">Form Controls</h5>
                                            <div className="card-body">
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="exampleFormControlInput1"
                                                        className="form-label"
                                                    >
                                                        Email address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="exampleFormControlInput1"
                                                        placeholder="name@example.com"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="exampleFormControlReadOnlyInput1"
                                                        className="form-label"
                                                    >
                                                        Read only
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        id="exampleFormControlReadOnlyInput1"
                                                        defaultValue="Readonly input here..."
                                                        aria-label="readonly input example"
                                                        readOnly=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="exampleFormControlReadOnlyInputPlain1"
                                                        className="form-label"
                                                    >
                                                        Read plain
                                                    </label>
                                                    <input
                                                        type="text"
                                                        readOnly=""
                                                        className="form-control-plaintext"
                                                        id="exampleFormControlReadOnlyInputPlain1"
                                                        defaultValue="email@example.com"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="exampleFormControlSelect1"
                                                        className="form-label"
                                                    >
                                                        Example select
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        id="exampleFormControlSelect1"
                                                        aria-label="Default select example"
                                                    >
                                                        <option selected="">Open this select menu</option>
                                                        <option value={1}>One</option>
                                                        <option value={2}>Two</option>
                                                        <option value={3}>Three</option>
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="exampleDataList" className="form-label">
                                                        Datalist example
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        list="datalistOptions"
                                                        id="exampleDataList"
                                                        placeholder="Type to search..."
                                                    />
                                                    <datalist id="datalistOptions">
                                                        <option value="San Francisco" />
                                                        <option value="New York" />
                                                        <option value="Seattle" />
                                                        <option value="Los Angeles" />
                                                        <option value="Chicago" />
                                                    </datalist>
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="exampleFormControlSelect2"
                                                        className="form-label"
                                                    >
                                                        Example multiple select
                                                    </label>
                                                    <select
                                                        multiple=""
                                                        className="form-select"
                                                        id="exampleFormControlSelect2"
                                                        aria-label="Multiple select example"
                                                    >
                                                        <option selected="">Open this select menu</option>
                                                        <option value={1}>One</option>
                                                        <option value={2}>Two</option>
                                                        <option value={3}>Three</option>
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="exampleFormControlSelect3"
                                                        className="form-label"
                                                    >
                                                        An example of a multi-select option is the 'size'
                                                        attribute
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        id="exampleFormControlSelect3"
                                                        size={2}
                                                        aria-label="Size 2 select example"
                                                    >
                                                        <option selected="">Open this select menu</option>
                                                        <option value={1}>One</option>
                                                        <option value={2}>Two</option>
                                                        <option value={3}>Three</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="exampleFormControlTextarea1"
                                                        className="form-label"
                                                    >
                                                        Example textarea
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        id="exampleFormControlTextarea1"
                                                        rows={3}
                                                        defaultValue={""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Input Sizing */}
                                    <div className="col-md-6">
                                        <div className="card">
                                            <h5 className="card-header">Input Sizing &amp; Shape</h5>
                                            <div className="card-body">
                                                <small className="fw-medium">Input text</small>
                                                <div className="mt-2 mb-4">
                                                    <label htmlFor="largeInput" className="form-label">
                                                        Large input
                                                    </label>
                                                    <input
                                                        id="largeInput"
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder=".form-control-lg"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="defaultInput" className="form-label">
                                                        Default input
                                                    </label>
                                                    <input
                                                        id="defaultInput"
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="Default input"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="smallInput" className="form-label">
                                                        Small input
                                                    </label>
                                                    <input
                                                        id="smallInput"
                                                        className="form-control form-control-sm"
                                                        type="text"
                                                        placeholder=".form-control-sm"
                                                    />
                                                </div>
                                            </div>
                                            <hr className="m-0" />
                                            <div className="card-body">
                                                <small className="fw-medium">Input select</small>
                                                <div className="mt-2 mb-4">
                                                    <label htmlFor="largeSelect" className="form-label">
                                                        Large select
                                                    </label>
                                                    <select
                                                        id="largeSelect"
                                                        className="form-select form-select-lg"
                                                    >
                                                        <option>Large select</option>
                                                        <option value={1}>One</option>
                                                        <option value={2}>Two</option>
                                                        <option value={3}>Three</option>
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="defaultSelect" className="form-label">
                                                        Default select
                                                    </label>
                                                    <select id="defaultSelect" className="form-select">
                                                        <option>Default select</option>
                                                        <option value={1}>One</option>
                                                        <option value={2}>Two</option>
                                                        <option value={3}>Three</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="smallSelect" className="form-label">
                                                        Small select
                                                    </label>
                                                    <select
                                                        id="smallSelect"
                                                        className="form-select form-select-sm"
                                                    >
                                                        <option>Small select</option>
                                                        <option value={1}>One</option>
                                                        <option value={2}>Two</option>
                                                        <option value={3}>Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <hr className="m-0" />
                                            <div className="card-body">
                                                <small className="fw-medium">Input Shape</small>
                                                <div className="mt-2">
                                                    <label htmlFor="roundedInput" className="form-label">
                                                        Rounded input
                                                    </label>
                                                    <input
                                                        id="roundedInput"
                                                        className="form-control rounded-pill"
                                                        type="text"
                                                        placeholder="Default input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Default Checkboxes and radios & Default checkboxes and radios */}
                                    <div className="col-xl-6">
                                        <div className="card mb-6">
                                            <h5 className="card-header">Checkboxes and Radios</h5>
                                            {/* Checkboxes and Radios */}
                                            <div className="row g-0">
                                                <div className="col-md p-6">
                                                    <small className="fw-medium">Checkboxes</small>
                                                    <div className="form-check mt-4">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            defaultValue=""
                                                            id="defaultCheck1"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="defaultCheck1"
                                                        >
                                                            {" "}
                                                            Unchecked{" "}
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            defaultValue=""
                                                            id="defaultCheck2"
                                                            defaultChecked=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="defaultCheck2"
                                                        >
                                                            {" "}
                                                            Indeterminate{" "}
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            defaultValue=""
                                                            id="defaultCheck3"
                                                            defaultChecked=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="defaultCheck3"
                                                        >
                                                            {" "}
                                                            Checked{" "}
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            defaultValue=""
                                                            id="disabledCheck1"
                                                            disabled=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="disabledCheck1"
                                                        >
                                                            {" "}
                                                            Disabled Unchecked{" "}
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            defaultValue=""
                                                            id="disabledCheck2"
                                                            disabled=""
                                                            defaultChecked=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="disabledCheck2"
                                                        >
                                                            {" "}
                                                            Disabled Checked{" "}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md p-6">
                                                    <small className="fw-medium">Radio</small>
                                                    <div className="form-check mt-4">
                                                        <input
                                                            name="default-radio-1"
                                                            className="form-check-input"
                                                            type="radio"
                                                            defaultValue=""
                                                            id="defaultRadio1"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="defaultRadio1"
                                                        >
                                                            {" "}
                                                            Unchecked{" "}
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            name="default-radio-1"
                                                            className="form-check-input"
                                                            type="radio"
                                                            defaultValue=""
                                                            id="defaultRadio2"
                                                            defaultChecked=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="defaultRadio2"
                                                        >
                                                            {" "}
                                                            Checked{" "}
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            defaultValue=""
                                                            id="disabledRadio1"
                                                            disabled=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="disabledRadio1"
                                                        >
                                                            {" "}
                                                            Disabled unchecked{" "}
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            defaultValue=""
                                                            id="disabledRadio2"
                                                            disabled=""
                                                            defaultChecked=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="disabledRadio2"
                                                        >
                                                            {" "}
                                                            Disabled checkbox{" "}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="m-0" />
                                            {/* Inline Checkboxes */}
                                            <div className="row g-0">
                                                <div className="col-md p-6">
                                                    <small className="fw-medium d-block">
                                                        Inline Checkboxes
                                                    </small>
                                                    <div className="form-check form-check-inline mt-4">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="inlineCheckbox1"
                                                            defaultValue="option1"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="inlineCheckbox1"
                                                        >
                                                            1
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="inlineCheckbox2"
                                                            defaultValue="option2"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="inlineCheckbox2"
                                                        >
                                                            2
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="inlineCheckbox3"
                                                            defaultValue="option3"
                                                            disabled=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="inlineCheckbox3"
                                                        >
                                                            3 (disabled)
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md p-6">
                                                    <small className="fw-medium d-block">Inline Radio</small>
                                                    <div className="form-check form-check-inline mt-4">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="inlineRadioOptions"
                                                            id="inlineRadio1"
                                                            defaultValue="option1"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="inlineRadio1"
                                                        >
                                                            1
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="inlineRadioOptions"
                                                            id="inlineRadio2"
                                                            defaultValue="option2"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="inlineRadio2"
                                                        >
                                                            2
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="inlineRadioOptions"
                                                            id="inlineRadio3"
                                                            defaultValue="option3"
                                                            disabled=""
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="inlineRadio3"
                                                        >
                                                            3 (disabled)
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Switches */}
                                        <div className="card mb-6">
                                            <div className="row row-bordered g-0">
                                                <div className="col-xxl-6 col-xl-12 col-md-6">
                                                    <h5 className="card-header">Switches</h5>
                                                    <div className="card-body">
                                                        <div className="form-check form-switch mb-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="flexSwitchCheckDefault"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="flexSwitchCheckDefault"
                                                            >
                                                                Default switch checkbox input
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-switch mb-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="flexSwitchCheckChecked"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="flexSwitchCheckChecked"
                                                            >
                                                                Checked switch checkbox input
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-switch mb-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="flexSwitchCheckDisabled"
                                                                disabled=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="flexSwitchCheckDisabled"
                                                            >
                                                                Disabled switch checkbox input
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="flexSwitchCheckCheckedDisabled"
                                                                defaultChecked=""
                                                                disabled=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="flexSwitchCheckCheckedDisabled"
                                                            >
                                                                Disabled checked switch checkbox input
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xxl-6 col-xl-12 col-md-6">
                                                    <h5 className="card-header text-end">Reverse</h5>
                                                    <div className="card-body">
                                                        <div className="form-check form-check-reverse">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                defaultValue=""
                                                                id="reverseCheck1"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="reverseCheck1"
                                                            >
                                                                {" "}
                                                                Reverse checkbox{" "}
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-reverse">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                defaultValue=""
                                                                id="reverseCheck2"
                                                                disabled=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="reverseCheck2"
                                                            >
                                                                {" "}
                                                                Disabled reverse checkbox{" "}
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-reverse">
                                                            <input
                                                                name="reverse-radio-1"
                                                                className="form-check-input"
                                                                type="radio"
                                                                defaultValue=""
                                                                id="reverseRadio1"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="reverseRadio1"
                                                            >
                                                                {" "}
                                                                Unchecked{" "}
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-reverse">
                                                            <input
                                                                name="reverse-radio-1"
                                                                className="form-check-input"
                                                                type="radio"
                                                                defaultValue=""
                                                                id="reverseRadio2"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="reverseRadio2"
                                                            >
                                                                {" "}
                                                                Checked{" "}
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-switch form-check-reverse mb-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="flexSwitchCheckReverse"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="flexSwitchCheckReverse"
                                                            >
                                                                Reverse switch checkbox input
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Range */}
                                        <div className="card">
                                            <h5 className="card-header">Range</h5>
                                            <div className="card-body">
                                                <div className="mb-4">
                                                    <label htmlFor="formRange1" className="form-label">
                                                        Example range
                                                    </label>
                                                    <input
                                                        type="range"
                                                        className="form-range"
                                                        id="formRange1"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="disabledRange" className="form-label">
                                                        Disabled range
                                                    </label>
                                                    <input
                                                        type="range"
                                                        className="form-range"
                                                        id="disabledRange"
                                                        disabled=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="formRange2" className="form-label">
                                                        Min and max
                                                    </label>
                                                    <input
                                                        type="range"
                                                        className="form-range"
                                                        min={0}
                                                        max={5}
                                                        id="formRange2"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="formRange3" className="form-label">
                                                        Steps
                                                    </label>
                                                    <input
                                                        type="range"
                                                        className="form-range"
                                                        min={0}
                                                        max={5}
                                                        step="0.5"
                                                        id="formRange3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        {/* HTML5 Inputs */}
                                        <div className="card mb-6">
                                            <h5 className="card-header">HTML5 Inputs</h5>
                                            <div className="card-body">
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Text
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            defaultValue="Sneat"
                                                            id="html5-text-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-search-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Search
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="search"
                                                            defaultValue="Search ..."
                                                            id="html5-search-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-email-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Email
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="email"
                                                            defaultValue="john@example.com"
                                                            id="html5-email-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-url-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        URL
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="url"
                                                            defaultValue="https://themeselection.com"
                                                            id="html5-url-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-tel-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Phone
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="tel"
                                                            defaultValue="90-(164)-188-556"
                                                            id="html5-tel-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-password-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Password
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="password"
                                                            defaultValue="password"
                                                            id="html5-password-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-number-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Number
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            defaultValue={18}
                                                            id="html5-number-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-datetime-local-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Datetime
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="datetime-local"
                                                            defaultValue="2021-06-18T12:30:00"
                                                            id="html5-datetime-local-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-date-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Date
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="date"
                                                            defaultValue="2021-06-18"
                                                            id="html5-date-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-month-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Month
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="month"
                                                            defaultValue="2021-06"
                                                            id="html5-month-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-week-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Week
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="week"
                                                            defaultValue="2021-W25"
                                                            id="html5-week-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-time-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Time
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="time"
                                                            defaultValue="12:30:00"
                                                            id="html5-time-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 row">
                                                    <label
                                                        htmlFor="html5-color-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Color
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            type="color"
                                                            className="form-control"
                                                            id="html5-color-input"
                                                            defaultValue="#666EE8"
                                                            title="Choose your color"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label
                                                        htmlFor="html5-range"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Range
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            type="range"
                                                            className="form-range mt-4"
                                                            id="html5-range"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* File input */}
                                        <div className="card">
                                            <h5 className="card-header">File input</h5>
                                            <div className="card-body">
                                                <div className="mb-4">
                                                    <label htmlFor="formFile" className="form-label">
                                                        Default file input example
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        id="formFile"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="formFileMultiple" className="form-label">
                                                        Multiple files input example
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        id="formFileMultiple"
                                                        multiple=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="formFileDisabled" className="form-label">
                                                        Disabled file input example
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        id="formFileDisabled"
                                                        disabled=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="formFileSm" className="form-label">
                                                        Small file input example
                                                    </label>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        id="formFileSm"
                                                        type="file"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="formFileLg" className="form-label">
                                                        Large file input example
                                                    </label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        id="formFileLg"
                                                        type="file"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* / Content */}
                            {/* Footer */}
                            <footer className="content-footer footer bg-footer-theme">
                                <div className="container-xxl">
                                    <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                                        <div className="mb-2 mb-md-0">
                                            © , made with ❤️ by
                                            <a
                                                href="https://themeselection.com"
                                                target="_blank"
                                                className="footer-link"
                                            >
                                                ThemeSelection
                                            </a>
                                        </div>
                                        <div className="d-none d-lg-inline-block">
                                            <a
                                                href="https://themeselection.com/item/category/admin-templates/"
                                                target="_blank"
                                                className="footer-link me-4"
                                            >
                                                Admin Templates
                                            </a>
                                            <a
                                                href="https://themeselection.com/license/"
                                                className="footer-link me-4"
                                                target="_blank"
                                            >
                                                License
                                            </a>
                                            <a
                                                href="https://themeselection.com/item/category/bootstrap-admin-templates/"
                                                target="_blank"
                                                className="footer-link me-4"
                                            >
                                                Bootstrap Dashboard
                                            </a>
                                            <a
                                                href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                                                target="_blank"
                                                className="footer-link me-4"
                                            >
                                                Documentation
                                            </a>
                                            <a
                                                href="https://github.com/themeselection/sneat-bootstrap-html-admin-template-free/issues"
                                                target="_blank"
                                                className="footer-link"
                                            >
                                                Support
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                            {/* / Footer */}
                            <div className="content-backdrop fade" />
                        </div>
                        {/* Content wrapper */}
                    </div>
                    {/* / Layout page */}
                </div>
                {/* Overlay */}
                <div className="layout-overlay layout-menu-toggle" />
            </div>
            {/* / Layout wrapper */}
            <div className="buy-now">
                <a
                    href="https://themeselection.com/item/sneat-dashboard-pro-bootstrap/"
                    target="_blank"
                    className="btn btn-danger btn-buy-now"
                >
                    Upgrade to Pro
                </a>
            </div>
            {/* Core JS */}
            {/* endbuild */}
            {/* Vendors JS */}
            {/* Main JS */}
            {/* Page JS */}
            {/* Place this tag before closing body tag for github widget button. */}
        </body>

    );
}

export default AddProduct;
