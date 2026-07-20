<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function dismiss(Request $request, Report $report): RedirectResponse
    {
        $report->update([
            'status' => 'dismissed',
            'resolved_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Report dismissed.');
    }
}
