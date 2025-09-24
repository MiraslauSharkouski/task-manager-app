<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DocumentationController extends Controller
{
    /**
     * Show API documentation
     * 
     * @group Documentation
     * 
     * @response 200 {
     *   "message": "API Documentation Endpoint"
     * }
     */
    public function index()
    {
        return response()->json(['message' => 'API Documentation Endpoint']);
    }
}
